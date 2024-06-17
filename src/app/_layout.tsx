import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { initializeDatabase } from "@/database/initializeDatabase";
import { useConfigDatabase } from "@/database/useDatabase";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { UserContextProvider, useUserContext } from "./contexts/userContext";
import { useTheme } from "./hooks/useTheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)/activities",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SQLiteProvider databaseName="SQLite.db" onInit={initializeDatabase}>
      <UserContextProvider>
        <GestureHandlerRootView>
          <Screens />
        </GestureHandlerRootView>
      </UserContextProvider>
    </SQLiteProvider>
  );
}

function Screens() {
  const { userTheme, setUserTheme } = useUserContext();
  const theme = useTheme();

  const colorScheme = useColorScheme();

  const { getTheme } = useConfigDatabase();

  useEffect(() => {
    async function getSavedTheme() {
      console.log("vai pegar");
      const theme = await getTheme();
      if (!theme && colorScheme) {
        setUserTheme(colorScheme);
      } else if (theme) {
        setUserTheme(theme);
      }
      console.log("pegou: ", theme);
    }

    getSavedTheme();
  }, []);

  // criar contexto que envolva todo o app, quando mudar o tema nas configs,
  //muda o tema no state do contexto, isso vai refletir em todo o app. Quando o app iniciar, faz o set no state global de tema para o tema salvo.

  const defaultLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: theme.primary,
      primaryContainer: theme.primaryOff,
    },
  };

  const defaultDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: theme.primary,
      primaryContainer: theme.primaryOff,
    } as MD3Colors,
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      card: "#000",
    },
  };

  return (
    <ThemeProvider
      value={theme.currentScheme === "dark" ? CustomDarkTheme : DefaultTheme}
    >
      <PaperProvider
        theme={
          theme.currentScheme === "dark" ? defaultDarkTheme : defaultLightTheme
        }
      >
        <Stack
          screenOptions={{
            statusBarColor: theme.background,
            navigationBarColor: theme.background,
            statusBarStyle: theme.currentScheme === "dark" ? "light" : "dark",
            animation: "ios",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="create/activity/index"
            options={{ title: "Criar atividade" }}
          />
          <Stack.Screen
            name="edit/activity/[id]"
            options={{ title: "Editar atividade" }}
          />
          <Stack.Screen
            name="details/activity/[id]"
            options={{ title: "Detalhes da atividade" }}
          />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}
