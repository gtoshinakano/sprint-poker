import { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { FirebaseError } from "firebase/app";

export interface AuthStateContext {
  userId: string | null;
  status: "checking" | "authenticated" | "unauthenticated";
  displayName: string | null;
  message: string | null;
  handleLoginWithCredentials: (
    email: string,
    password: string
  ) => Promise<void>;
  handleRegisterWithCredentials: (
    email: string,
    password: string
  ) => Promise<void>;
  handleAnonymousLogin: (displayName: string) => Promise<void>;
  handleLogOut: () => Promise<void>;
  user?: User | null;
}

const initialState: Pick<
  AuthStateContext,
  "status" | "userId" | "displayName"
> = {
  userId: null,
  displayName: null,
  status: "checking",
};

export const AuthContext = createContext({} as AuthStateContext);

interface IElement {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IElement) => {
  const [session, setSession] = useState(initialState);
  const [message, setMessage] = useState("");
  const [userObj, setUserObj] = useState<User | null>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserObj(null);
        return setSession({
          status: "unauthenticated",
          userId: null,
          displayName: null,
        });
      }
      setUserObj(user);
      setSession({
        status: "authenticated",
        userId: user.uid,
        displayName: user.displayName,
      });
    });
  }, []);

  const checking = () =>
    setSession((prev) => ({ ...prev, status: "checking" }));

  const validateAuth = (
    userId: string | undefined,
    displayName: string | null
  ) => {
    if (userId)
      return setSession({ userId, displayName, status: "authenticated" });
    return setSession({
      userId: null,
      displayName: null,
      status: "unauthenticated",
    });
  };

  const handleLoginWithCredentials = async (
    email: string,
    password: string
  ) => {
    checking();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      validateAuth(user.uid, user.displayName);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setMessage(e.code);
      }
      setSession({
        userId: null,
        displayName: null,
        status: "unauthenticated",
      });
    }
  };

  const handleAnonymousLogin = async (displayName: string) => {
    checking();
    const { user } = await signInAnonymously(auth);
    await updateProfile(user, { displayName });
    validateAuth(user.uid, displayName);
  };

  const handleRegisterWithCredentials = async (
    email: string,
    password: string
  ) => {
    checking();
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    validateAuth(user.uid, user.displayName);
  };

  const handleLogOut = async () => {
    await signOut(auth);
    setSession({ userId: null, displayName: null, status: "unauthenticated" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        message,
        handleLoginWithCredentials,
        handleRegisterWithCredentials,
        handleAnonymousLogin,
        handleLogOut,
        user: userObj,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
