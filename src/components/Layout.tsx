import { ReactNode, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type LayoutProps = {
  isProtected?: boolean;
  isAnonymous?: boolean;
  children: ReactNode;
};

const Layout = ({ children, isProtected, isAnonymous = true }: LayoutProps) => {
  const { userId, handleLogOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const redirectUrl =
    isAnonymous && roomId ? `/signin-room/${roomId}` : "/login";

  useEffect(() => {
    if (isProtected && !userId) {
      navigate(redirectUrl);
    }
  }, [isProtected, navigate, userId, redirectUrl]);

  const logoutHandler = async () => {
    await handleLogOut();
    navigate(redirectUrl);
  };
  return (
    <>
      <header className="w-full bg-blue-100 flex py-2 px-6 fixed">
        <h1 className="grow text-lg font-semibold">Sprint Poker</h1>
        <div>
          {!userId ? (
            <button className="" onClick={() => navigate("/login")}>
              Sign In
            </button>
          ) : (
            <button className="" onClick={logoutHandler}>
              Logout
            </button>
          )}
        </div>
      </header>
      <main className="h-screen w-screen flex">{children}</main>
    </>
  );
};

export default Layout;
