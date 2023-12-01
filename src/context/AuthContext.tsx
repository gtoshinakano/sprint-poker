import { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { FirebaseError } from "firebase/app";

export interface AuthStateContext {
  userId: string | null;
  status: "checking" | "authenticated" | "unauthenticated";
  message: string | null;
  handleLoginWithCredentials: (
    email: string,
    password: string
  ) => Promise<void>;
  handleRegisterWithCredentials: (
    email: string,
    password: string
  ) => Promise<void>;
  handleLogOut: () => Promise<void>;
}

const initialState: Pick<AuthStateContext, "status" | "userId"> = {
  userId: null,
  status: "checking",
};

export const AuthContext = createContext({} as AuthStateContext);

interface IElement {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IElement) => {
  const [session, setSession] = useState(initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) return setSession({ status: "unauthenticated", userId: null });
      setSession({ status: "authenticated", userId: user.uid });
    });
  }, []);

  const checking = () =>
    setSession((prev) => ({ ...prev, status: "checking" }));

  const validateAuth = (userId: string | undefined) => {
    if (userId) return setSession({ userId, status: "authenticated" });
    return setSession({ userId: null, status: "unauthenticated" });
  };

  const handleLoginWithCredentials = async (
    email: string,
    password: string
  ) => {
    checking();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      validateAuth(user.user.uid);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setMessage(e.code);
      }
      setSession({ userId: null, status: "unauthenticated" });
    }
  };

  const handleRegisterWithCredentials = async (
    email: string,
    password: string
  ) => {
    checking();
    const user = await createUserWithEmailAndPassword(auth, email, password);
    validateAuth(user.user.uid);
  };

  const handleLogOut = async () => {
    await signOut(auth);
    setSession({ userId: null, status: "unauthenticated" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        message,
        handleLoginWithCredentials,
        handleRegisterWithCredentials,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
