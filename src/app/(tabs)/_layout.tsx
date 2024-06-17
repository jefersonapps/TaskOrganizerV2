import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";

function TabBarIconFA(props: {
  name: keyof typeof FontAwesome6.glyphMap;
  color: string;
}) {
  return <FontAwesome6 size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIconMA(props: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: useClientOnlyValue(false, true),
        headerTintColor: theme.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Atividades",
          tabBarIcon: ({ color }) => (
            <TabBarIconFA name="list-check" color={color} />
          ),
          headerRight: () => (
            <Link href="/config" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome6
                    name="gear"
                    size={25}
                    color={theme.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => (
            <TabBarIconFA name="calendar-days" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Arquivos",
          tabBarIcon: ({ color }) => (
            <TabBarIconFA name="folder" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="latex"
        options={{
          title: "LaTeX",
          tabBarIcon: ({ color }) => <TabBarIconFA name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr-code"
        options={{
          title: "QR Code",
          tabBarIcon: ({ color }) => (
            <TabBarIconFA name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lit-lens"
        options={{
          title: "Lit Lens",
          tabBarIcon: ({ color }) => (
            <TabBarIconMA name="google-lens" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => <TabBarIconFA name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
