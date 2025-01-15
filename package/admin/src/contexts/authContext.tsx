"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { User, UserResponse } from "@/features/auth/types";
import { client } from "@/libs/axios";
import { getTokenCookie } from "@/libs/cookie";

export type UserState = User | null | undefined;
export type AuthContextType = {
  user: UserState;
};

export type SetAuthContextType = {
  setUser: Dispatch<SetStateAction<UserState>>;
};

const initialState: UserState = undefined;
const AuthContext = createContext<AuthContextType>({ user: initialState });
const SetAuthContext = createContext<SetAuthContextType>(
  {} as SetAuthContextType
);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserState>(initialState);
  const cookie = getTokenCookie();
  // const cookie = getToken();
  useEffect(() => {
    async function getUser() {
      const { data }  = await client.get<UserResponse>("/user");
      if (data) {
        setUser(new User(data?.user));
      }
    }
    if (!user && cookie) getUser();
  }, [user, cookie]);

  return (
    <AuthContext.Provider value={{ user }}>
      <SetAuthContext.Provider value={{ setUser }}>
        {children}
      </SetAuthContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useSetAuthContext = () => useContext(SetAuthContext);
