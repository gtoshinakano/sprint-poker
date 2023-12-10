import { Suspense, useContext, useEffect } from "react";
import { onValue, onDisconnect, set, off, remove } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { connectedRef, playerStatusRef } from "../repository/status";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../repository/room";
import RoomHeader from "../components/RoomHeader";
import { getCurrentRound } from "../repository/round";
import PlayFooter from "../components/PlayFooter";
import PlayerManager from "../components/PlayerManager";
import PokerTable from "../components/PokerTable";
import { playCard } from "../service/roomPlayers";
import ResultsFooter from "../components/ResultsFooter";

const Room = () => {
  const { roomId } = useParams();
  const { userId, displayName, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId!),
    enabled: Boolean(roomId),
  });

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return () => null;
    }

    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() && userId) {
        onDisconnect(playerStatusRef(roomId, userId)).remove();
        set(playerStatusRef(roomId, userId), { displayName, isWatcher: false });
      }
    });
    return () => {
      off(connectedRef);
      remove(playerStatusRef(roomId, userId!));
    };
  }, [displayName, navigate, roomId, userId]);

  const {
    data: currentRound,
    refetch: refetchRound,
    isFetched,
  } = useQuery({
    queryKey: ["round", roomId],
    queryFn: () => getCurrentRound(roomId!),
    staleTime: Infinity,
  });

  const roundInfo = currentRound && Object.values(currentRound)[0];
  const roundId = currentRound && Object.keys(currentRound)[0];

  if (isFetched && !roundInfo) navigate(userId ? "/" : `signin-room/${roomId}`);

  if (!roomId || !userId || !roundId) return <Spinner fullScreen size="lg" />;

  const selectCard = (card: string | null) =>
    playCard(roomId, userId, { [`answer-${roundId}`]: card });

  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Layout isAnonymous isProtected>
        <section className="flex w-screen">
          <div className="m-auto h-[96vh] flex flex-col justify-between gap-3">
            <div className="flex flex-col w-full">
              <h3 className="text-xs text-sky-500">
                Sprint Poker / room / {roomData?.roomName}
              </h3>
              {roundInfo && roundId && roomId && (
                <RoomHeader
                  userId={userId}
                  roundInfo={roundInfo}
                  roundId={roundId}
                  roomId={roomId}
                />
              )}
            </div>
            {roundInfo?.state &&
              ["playing", "results"].includes(roundInfo?.state) && (
                <PokerTable
                  roomId={roomId}
                  userId={userId}
                  state={roundInfo?.state}
                  roundId={roundId}
                  isHost={!user?.isAnonymous}
                />
              )}
            {roundInfo?.state === "playing" && (
              <PlayFooter
                deck={roundInfo.deck}
                onChange={selectCard}
                userId={userId}
              />
            )}
            {roundInfo?.state === "results" && (
              <ResultsFooter
                deck={roundInfo.deck}
                roundInfo={roundInfo}
                readOnly={user?.isAnonymous ?? true}
                roomId={roomId}
                roundId={roundId}
                userId={userId}
              />
            )}
          </div>
        </section>
        <PlayerManager
          readOnly={user?.isAnonymous}
          userId={userId}
          roomId={roomId}
          roundId={roundId}
          refetchRound={refetchRound}
        />
      </Layout>
    </Suspense>
  );
};

export default Room;
