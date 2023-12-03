import Layout from "./components/Layout";
import { RiFileCopyFill } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";

function App() {
  return (
    <Layout isProtected>
      <section className="w-screen h-screen flex flex-col ">
        <div className="m-auto flex flex-col bg-blue-100 max-w-md py-4 px-3 rounded-lg gap-2">
          <h2 className="font-semibold text-lg">Create Room</h2>
          <input
            className="bg-white py-2 px-3 rounded-md"
            title="type room name"
            placeholder="Type room name"
          />
          <button className="bg-cyan-800 py-2 px-3 rounded-md text-white font-semibold">
            Create
          </button>
          <div className="mt-1 py-2 flex flex-col bg-white bg-opacity-30 gap-1">
            <h3 className="px-2 font-semibold">Open Rooms</h3>
            <div className="p-2 flex text-lg gap-1 hover:bg-blue-200 transform duration-100">
              <span className="grow text-gray-500 text-sm my-auto mr-6">
                /a-really-big-title-because-it-can-be-a-url
              </span>
              <button
                className="p-1.5 bg-cyan-400 text-white rounded-lg"
                title="copy-url"
              >
                <RiFileCopyFill />
              </button>
              <button
                className="p-1.5 bg-red-400 text-white rounded-lg"
                title="close-room"
              >
                <AiFillCloseCircle />
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default App;
