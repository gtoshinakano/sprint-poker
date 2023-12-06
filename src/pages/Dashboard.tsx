import Layout from "../components/Layout";
import { RiFileCopyFill } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRooms } from "../repository/room";
import { initRoom } from "../service/initRoom";

function Dashboard() {
  const [roomName, setRoomName] = useState("");
  const { user, displayName } = useContext(AuthContext);
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: initRoom,
    onSuccess: () => client.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
    staleTime: Infinity,
  });

  return (
    <Layout isProtected>
      <section className="w-screen h-screen flex flex-col ">
        <div className="m-auto flex flex-col bg-blue-100 max-w-lg py-4 px-3 rounded-lg gap-2">
          <h1 className="font-semibold text-2xl">Hello {displayName}!</h1>
          {!user?.isAnonymous && (
            <>
              <h2 className="font-semibold text-lg">Create Room</h2>
              <input
                className="bg-white py-2 px-3 rounded-md"
                title="type room name"
                placeholder="Type room name"
                value={roomName}
                onChange={({ target }) => setRoomName(target.value)}
              />
              <button
                className="bg-cyan-800 py-2 px-3 rounded-md text-white font-semibold"
                onClick={() => mutate(roomName)}
              >
                Create
              </button>
            </>
          )}
          <div className="mt-1 py-2 flex flex-col bg-white bg-opacity-30 gap-1">
            <h3 className="px-2 font-semibold">Open Rooms</h3>
            {rooms &&
              Object.entries(rooms!)?.map(([key, data]) => (
                <div
                  className="flex text-lg gap-1 hover:bg-blue-200 transform duration-100"
                  key={key}
                >
                  <Link to={`/room/${key}`} className="p-2 grow">
                    <span className="text-gray-500 text-sm my-auto mr-6">
                      {data.roomName}
                    </span>
                  </Link>
                  <button
                    className="p-1.5 bg-cyan-400 text-white rounded-lg my-2 mr-1.5"
                    title="copy-url"
                  >
                    <RiFileCopyFill />
                  </button>
                  {!user?.isAnonymous && (
                    <button
                      className="p-1.5 bg-red-400 text-white rounded-lg my-2 mr-1.5"
                      title="close-room"
                    >
                      <AiFillCloseCircle />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
