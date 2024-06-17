import { DEFAULT_USER_PREFERENCES } from "@/constants/default/defaultValues";
import { Theme } from "@/database/useDatabase";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type Scheme = "light" | "dark";

export type UserContextProps = {
  userTheme: Theme;
  setUserTheme: Dispatch<SetStateAction<Theme>>;
  palette: string;
  setPalette: Dispatch<SetStateAction<string>>;
  avatar: string;
  setAvatar: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  security: boolean;
  setSecurity: Dispatch<SetStateAction<boolean>>;
  currentColorScheme: Scheme;
  setCurrentColorScheme: Dispatch<SetStateAction<Scheme>>;
};

const UserContext = createContext<UserContextProps>(DEFAULT_USER_PREFERENCES);

export function useUserContext(): UserContextProps {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a provider");
  }
  return context;
}

export function UserContextProvider({ children }: { children: JSX.Element }) {
  const [userTheme, setUserTheme] = useState(
    DEFAULT_USER_PREFERENCES.userTheme
  );
  const [palette, setPalette] = useState(DEFAULT_USER_PREFERENCES.palette);
  const [avatar, setAvatar] = useState(DEFAULT_USER_PREFERENCES.avatar);
  const [name, setName] = useState(DEFAULT_USER_PREFERENCES.name);
  const [security, setSecurity] = useState(DEFAULT_USER_PREFERENCES.security);
  const [currentColorScheme, setCurrentColorScheme] = useState<Scheme>("dark");

  return (
    <UserContext.Provider
      value={{
        userTheme,
        setUserTheme,
        palette,
        setPalette,
        avatar,
        setAvatar,
        name,
        setName,
        security,
        setSecurity,
        currentColorScheme,
        setCurrentColorScheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
