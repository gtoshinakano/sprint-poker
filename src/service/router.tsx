import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Room from "../pages/Room";
import ErrorPage from "../pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
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
