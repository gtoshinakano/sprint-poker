import { Suspense, useContext, useEffect } from "react";
import { onValue, onDisconnect, set, off } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { connectedRef, statusRef } from "../repository/status";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../repository/room";

const Room = () => {
  const { roomId } = useParams();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const query = await getRoom(roomId!);
      return query.val();
    },
    enabled: Boolean(roomId),
  });
  console.log(roomData);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return () => null;
    }

    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() && userId) {
        onDisconnect(statusRef(roomId, userId)).remove();
        set(statusRef(roomId, userId), true);
      }
    });
    return () => off(connectedRef);
  }, []);

  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Layout isAnonymous isProtected>
        <section className="flex w-screen">
          <div className="m-auto">room app</div>
        </section>
      </Layout>
    </Suspense>
  );
};

export default Room;
