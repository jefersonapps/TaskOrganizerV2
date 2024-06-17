import { Input } from "@/components/Input";
import { Text } from "@/components/Themed";
import {
  Activity,
  PriorityLevel,
  useActivitiesDatabase,
} from "@/database/useDatabase";
import { formatDate } from "@/helpers/formatDate";

import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";
import { FAB, RadioButton } from "react-native-paper";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateScreen() {
  const [newActivity, setNewActivity] = useState<Activity>({
    id: "",
    title: "",
    content: "",
    priority: "medium",
    deliveryDate: null,
    checked: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const activitiesDatabase = useActivitiesDatabase();

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios"); // Esconde apenas no iOS
    if (selectedDate) {
      setNewActivity({
        ...newActivity,
        deliveryDate: selectedDate.toISOString(),
      });
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(Platform.OS === "ios"); // Esconde apenas no iOS
    if (selectedTime) {
      const currentDate = newActivity.deliveryDate
        ? new Date(newActivity.deliveryDate)
        : new Date();
      currentDate.setHours(selectedTime.getHours());
      currentDate.setMinutes(selectedTime.getMinutes());
      setNewActivity({
        ...newActivity,
        deliveryDate: currentDate.toISOString(),
      });
    }
  };

  async function create() {
    try {
      if (newActivity.title === "") {
        Alert.alert("Erro", "Preencha o título da atividade.");
        return;
      }
      const newId = Date.now().toString();
      await activitiesDatabase.create({ ...newActivity, id: newId });
      setNewActivity({
        id: "",
        title: "",
        content: "",
        priority: "medium",
        deliveryDate: null,
        checked: false,
      });
      router.navigate({ pathname: "/" });
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      Alert.alert("Erro", "Ocorreu um erro ao criar a atividade.");
    }
  }

  const date = formatDate(newActivity.deliveryDate).date;
  const time = formatDate(newActivity.deliveryDate).time;
  return (
    <View style={styles.container}>
      {/* Formulário para nova atividade */}
      <View style={styles.formContainer}>
        <Input
          mode="outlined"
          label="Título"
          value={newActivity.title}
          onChangeText={(text) =>
            setNewActivity({ ...newActivity, title: text })
          }
        />
        <Input
          mode="outlined"
          label="Conteúdo"
          value={newActivity.content}
          onChangeText={(text) =>
            setNewActivity({ ...newActivity, content: text })
          }
          validate={{
            validation: () => newActivity.content.length > 0,
            helperText: "Insira um conteúdo válido!",
          }}
        />
        <View style={styles.priorityContainer}>
          <Text>Prioridade:</Text>

          <RadioButton.Group
            onValueChange={(newValue) =>
              setNewActivity({
                ...newActivity,
                priority: newValue as PriorityLevel,
              })
            }
            value={newActivity.priority}
          >
            <View style={styles.row}>
              <View>
                <Text>Alta</Text>
                <RadioButton value="hight" />
              </View>
              <View>
                <Text>Média</Text>
                <RadioButton value="medium" />
              </View>
              <View>
                <Text>Baixa</Text>
                <RadioButton value="low" />
              </View>
            </View>
          </RadioButton.Group>
        </View>
        <View>
          <Button
            title="Selecionar Data"
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={
                newActivity.deliveryDate
                  ? new Date(newActivity.deliveryDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View>
          <Button
            title="Selecionar Hora"
            onPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={
                newActivity.deliveryDate
                  ? new Date(newActivity.deliveryDate)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={handleTimeChange}
              is24Hour={true} // Define o formato de 24 horas
            />
          )}
        </View>

        {newActivity.deliveryDate && (
          <Text>
            Data e Hora de Entrega: {date} às {time}
          </Text>
        )}
      </View>
      <View style={styles.sendButton}>
        <FAB icon="send" onPress={create} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  formContainer: {
    marginBottom: 20,
    gap: 16,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priorityOptions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  activityItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityContent: {},
  activityTitle: {
    fontWeight: "bold",
  },
  activityContentText: {
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  pageInfo: {
    fontSize: 16,
  },
  sendButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
