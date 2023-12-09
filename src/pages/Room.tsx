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

  const { data: currentRound } = useQuery({
    queryKey: ["round", roomId, "currentRound"],
    queryFn: () => getCurrentRound(roomId!),
    staleTime: 5000,
  });

  const roundInfo = currentRound && Object.values(currentRound)[0];
  const roundId = currentRound && Object.keys(currentRound)[0];

  if (!roomId) return <Spinner fullScreen />;

  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Layout isAnonymous isProtected>
        <section className="flex w-screen">
          <div className="m-auto max-w-[80vw] h-[90vh] flex flex-col justify-between">
            <div className="flex flex-col w-full">
              <h3 className="text-xs text-sky-500">
                Sprint Poker / room / {roomData?.roomName}
              </h3>
              {roundInfo && roundId && roomId && (
                <RoomHeader
                  roundInfo={roundInfo}
                  roundId={roundId}
                  roomId={roomId}
                />
              )}
            </div>
            <div></div>
            {roundInfo?.state === "playing" && (
              <PlayFooter
                deck={roundInfo.deck}
                onChange={() => console.log("selected")}
              />
            )}
          </div>
        </section>
        <PlayerManager
          readOnly={user?.isAnonymous}
          userId={userId}
          roomId={roomId}
        />
      </Layout>
    </Suspense>
  );
};

export default Room;
