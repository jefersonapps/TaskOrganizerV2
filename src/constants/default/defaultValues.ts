import { UserContextProps } from "@/app/contexts/userContext";

export const ITEMS_PER_PAGE = 10

export const PRIORITIES = {
  low: {
    label: 'Baixa',
    color: '#007aff',
  },
  medium: {
    label: 'Média',
    color: '#ff9f0a',
  },
  high: {
    label: 'Alta',
    color: '#ff453a',
  },
};


export const DEFAULT_USER_PREFERENCES: UserContextProps = {
  userTheme: "dark",
  setUserTheme: () => {},
  avatar: "",
  setAvatar: () => {},
  name: "",
  setName: () => {},
  palette: "",
  setPalette: () => {},
  security: false,
  setSecurity: () => {},
  currentColorScheme: "dark",
  setCurrentColorScheme: () => {}
  }