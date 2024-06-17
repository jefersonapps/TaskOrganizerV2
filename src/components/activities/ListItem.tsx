import { useTheme } from "@/app/hooks/useTheme";
import { PRIORITIES } from "@/constants/default/defaultValues";
import { Activity, useActivitiesDatabase } from "@/database/useDatabase";
import { formatDate } from "@/helpers/formatDate";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Badge, Card, IconButton } from "react-native-paper";
import { Text, View } from "../Themed";

type ActivityItemProps = {
  activity: Activity;
  onDelete: (id: string) => void;
  onEdit: () => void;
  handleShowDetails: (id: string) => void;
};

export const ListItem = ({
  activity,
  onDelete,
  onEdit,
  handleShowDetails,
}: ActivityItemProps) => {
  const theme = useTheme();
  const activitiesDatabase = useActivitiesDatabase();

  const [isChecked, setIsChecked] = useState(activity.checked);

  const toggleSwitch = async () => {
    try {
      await activitiesDatabase.update({
        ...activity,
        checked: !isChecked,
      });
      setIsChecked(!isChecked);
    } catch (error) {
      console.error("Erro ao alternar o estado da atividade:", error);
    }
  };

  const priorityLabel = PRIORITIES[activity.priority].label;

  const opacity = theme.scheme === "dark" ? "" : "50";
  const priorityColor = PRIORITIES[activity.priority].color + opacity;

  const priority = `Prioridade: ${priorityLabel}`;

  const date = formatDate(activity.deliveryDate).date;
  const time = formatDate(activity.deliveryDate).time;
  // Usuário poderá mudar a paleta de cores, criar tabela com o tema e acessar pelo hook de theme para puxar a const Colors correta
  // Permitir adicionar imagem, ao clicar na atividade, abir rota de details, mostrando todos os detalhes e permitindo dar zoom na imagem.

  return (
    <Card onPress={() => handleShowDetails(activity.id)}>
      <Card.Title title={activity.title} titleStyle={{ fontWeight: "bold" }} />
      <Card.Content>
        {activity.content && (
          <Text style={styles.contentText}>{activity.content}</Text>
        )}
        {activity.deliveryDate && (
          <Text>
            Entrega: {date} às {time?.slice(0, -3)} horas
          </Text>
        )}
        <View>
          <FontAwesome5 name="images" size={24} color={theme.primary} />
          <Text>Imagens</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <View
          style={{
            justifyContent: "flex-start",
            flex: 1,
          }}
        >
          <Badge
            style={{
              backgroundColor: priorityColor,
              marginRight: "auto",
              fontSize: 12,
              fontStyle: "italic",
              fontWeight: "bold",
              paddingHorizontal: 8,
              color: theme.dark.background,
            }}
          >
            {priority}
          </Badge>
        </View>
        <IconButton onPress={onEdit} icon="pencil" />
        <IconButton
          onPress={toggleSwitch}
          icon="check"
          mode={isChecked ? "contained" : "outlined"}
        />
        <IconButton onPress={() => onDelete(activity.id)} icon="delete" />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {},
  title: {
    fontWeight: "bold",
  },
  contentText: {
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
    borderRadius: 12,
  },
});
