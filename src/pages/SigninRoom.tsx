import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState(import.meta.env.VITE_DUMMY_EMAIL ?? "");
  const [pass, setPass] = useState("");
  const { status, handleLoginWithCredentials, message } =
    useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "authenticated") {
      navigate("/");
    }
  }, [navigate, status]);

  if (status === "checking") return <Spinner fullScreen size="lg" />;

  return (
    <main className="flex h-screen w-screen">
      <div className="max-w-md bg-blue-100 m-auto px-4 py-4 rounded-lg flex flex-col gap-1 w-full">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div className="flex flex-col gap-1">
          <label className="ml-1 flex" htmlFor="login-email">
            <span className="grow">Email</span>
            <span className="text-gray-500">{message}</span>
          </label>
          <input
            className="bg-white px-2.5 py-3 rounded-md border border-cyan-500"
            placeholder="Account Email"
            type="text"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="ml-1" htmlFor="login-password">
            Password
          </label>
          <input
            className="bg-white px-2.5 py-3 rounded-md border border-cyan-500"
            placeholder="Account Password"
            type="password"
            id="login-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button
            className="mt-4 p-3 bg-cyan-700 text-white font-semibold rounded-md text-lg uppercase"
            onClick={() => handleLoginWithCredentials(email, pass)}
          >
            Sign In
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
