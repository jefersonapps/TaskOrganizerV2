import { StyleSheet } from "react-native";

import { ExternalLink } from "@/components/ExternalLink";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes e relatório</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <ExternalLink href="https://github.com/jefersonapps">
        <Text lightColor={Colors.light.tint}>Jeferson Leite</Text>
      </ExternalLink>
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
