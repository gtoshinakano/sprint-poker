import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Room from "../pages/Room";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  },
  {
    path: "/signin-room",
    element: <Login isAnonymous />,
  },
  {
    path: "/signin-room/:roomId",
    element: <Login isAnonymous />,
  },
]);
