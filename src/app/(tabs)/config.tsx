import { StyleSheet, View } from "react-native";

import { useUserContext } from "@/app/contexts/userContext";
import { useTheme } from "@/app/hooks/useTheme";
import { Button } from "@/components/Button";
import { ExternalLink } from "@/components/ExternalLink";
import { Text } from "@/components/Themed";
import { ConfigItem } from "@/components/configs/ConfigItem";
import { useConfigDatabase } from "@/database/useDatabase";
import { router } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ConfigScreen() {
  const theme = useTheme();

  const { setUserData } = useConfigDatabase();
  const { userTheme } = useUserContext();

  useEffect(() => {
    async function saveUserPreferences() {
      await setUserData({
        avatar: "",
        name: "",
        palette: "",
        security: false,
        theme: userTheme,
      });
    }

    saveUserPreferences();
  }, [userTheme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes e relatório</Text>
      <View style={styles.separator} />

      <ConfigItem />
      <Button
        title="Preferencias"
        onPress={() => router.push("/settings/preferences")}
      />

      <TouchableOpacity activeOpacity={0.6}>
        <ExternalLink href="https://github.com/jefersonapps">
          <Text style={{ color: theme.primary }}>Jeferson Leite</Text>
        </ExternalLink>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
