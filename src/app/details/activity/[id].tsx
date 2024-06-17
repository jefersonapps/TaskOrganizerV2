import { useTheme } from "@/app/hooks/useTheme";
import { Text } from "@/components/Themed";
import { PRIORITIES } from "@/constants/default/defaultValues";
import { Activity, useActivitiesDatabase } from "@/database/useDatabase";
import { formatDate } from "@/helpers/formatDate";
import { ImageZoom, ImageZoomRef } from "@likashefqet/react-native-image-zoom";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { Badge, Card } from "react-native-paper";

export default function Details() {
  const { id } = useLocalSearchParams();
  const imageRef = useRef<ImageZoomRef>(null);
  const theme = useTheme();

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const activitiesDatabase = useActivitiesDatabase();

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = useCallback(async () => {
    if (id) {
      try {
        const activity = await activitiesDatabase.findById(id.toString());
        setSelectedActivity(activity);
      } catch (error) {
        console.error("Erro ao carregar atividade:", error);
        Alert.alert("Erro", "Ocorreu um erro ao carregar a atividade.");
      }
    }
  }, [id]);

  if (!selectedActivity) {
    return <Text>Carregando...</Text>;
  }

  const priorityLabel = PRIORITIES[selectedActivity.priority].label;

  const opacity = theme.currentScheme === "dark" ? "" : "50";
  const priorityColor = PRIORITIES[selectedActivity.priority].color + opacity;

  const priority = `Prioridade: ${priorityLabel}`;

  const date = formatDate(selectedActivity.deliveryDate).date;
  const time = formatDate(selectedActivity.deliveryDate).time;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Card>
        <Card.Title
          title={selectedActivity?.title}
          titleStyle={{ fontWeight: "bold" }}
        />
        <Card.Content>
          {selectedActivity?.content && (
            <Text>{selectedActivity?.content}</Text>
          )}
          {selectedActivity?.deliveryDate && (
            <Text>
              Entrega: {date} às {time?.slice(0, -3)} horas
            </Text>
          )}

          <View style={{ width: "100%", height: 400 }}>
            <ImageZoom
              ref={imageRef}
              uri={"https://avatars.githubusercontent.com/u/142559108?v=4"}
              minScale={0.5}
              maxScale={5}
              doubleTapScale={3}
              minPanPointers={1}
              isSingleTapEnabled
              isDoubleTapEnabled
              style={{ zIndex: 50 }}
              resizeMode="contain"
            />
          </View>

          <Badge
            style={{
              backgroundColor: priorityColor,
              marginRight: "auto",
              marginTop: 12,
              fontSize: 12,
              fontStyle: "italic",
              fontWeight: "bold",

              paddingHorizontal: 8,
              color: theme.dark.background,
            }}
          >
            {priority}
          </Badge>
        </Card.Content>
      </Card>
    </View>
  );
}
