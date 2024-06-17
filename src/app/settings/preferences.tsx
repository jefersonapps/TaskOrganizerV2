import { useUserContext } from "@/app/contexts/userContext";
import { Theme } from "@/database/useDatabase";
import { useState } from "react";
import { View } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";

export default function PreferencesScreen() {
  const { setUserTheme } = useUserContext();
  const [visible, setVisible] = useState(false);

  async function handleChangeTheme(mode: Theme) {
    setUserTheme(mode);
    setVisible(false);
  }

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View
      style={{
        paddingTop: 50,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Tema</Button>}
      >
        <Menu.Item onPress={() => handleChangeTheme("dark")} title="Escuro" />
        <Menu.Item onPress={() => handleChangeTheme("light")} title="Claro" />
        <Divider />
        <Menu.Item
          onPress={() => handleChangeTheme("system")}
          title="Sistema"
        />
      </Menu>
    </View>
  );
}
