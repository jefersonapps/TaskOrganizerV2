import { Input } from "@/components/Input";
import { Activity, useActivitiesDatabase } from "@/database/useDatabase";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const activitiesDatabase = useActivitiesDatabase();

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = useCallback(async () => {
    if (id) {
      try {
        const activity = await activitiesDatabase.findById(id.toString());
        setEditingActivity(activity);
      } catch (error) {
        console.error("Erro ao carregar atividade:", error);
        Alert.alert("Erro", "Ocorreu um erro ao carregar a atividade.");
      }
    }
  }, [id]);

  async function handleUpdateActivity() {
    try {
      if (editingActivity) {
        await activitiesDatabase.update(editingActivity);
        router.navigate({ pathname: "/" });
      }
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a atividade.");
    }
  }

  const handleDateConfirm = (date: Date) => {
    setShowDatePicker(false);
    const formattedDate = date.toISOString();
    if (editingActivity) {
      setEditingActivity({
        ...editingActivity,
        deliveryDate: formattedDate,
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!editingActivity) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Editar Atividade</Text>
        <Input
          mode="outlined"
          label="Título"
          value={editingActivity.title}
          onChangeText={(text) =>
            setEditingActivity({ ...editingActivity, title: text })
          }
        />
        <Input
          mode="outlined"
          label="Conteúdo"
          value={editingActivity.content}
          onChangeText={(text) =>
            setEditingActivity({ ...editingActivity, content: text })
          }
        />
        <View style={styles.priorityContainer}>
          <Text>Prioridade:</Text>
          <View style={styles.priorityOptions}>
            <Button
              title="Alta"
              onPress={() =>
                setEditingActivity({
                  ...editingActivity,
                  priority: "high",
                })
              }
              color={editingActivity.priority === "high" ? "red" : undefined}
            />
            <Button
              title="Média"
              onPress={() =>
                setEditingActivity({
                  ...editingActivity,
                  priority: "medium",
                })
              }
              color={
                editingActivity.priority === "medium" ? "orange" : undefined
              }
            />
            <Button
              title="Baixa"
              onPress={() =>
                setEditingActivity({
                  ...editingActivity,
                  priority: "low",
                })
              }
              color={editingActivity.priority === "low" ? "green" : undefined}
            />
          </View>
        </View>
        {editingActivity.deliveryDate && (
          <Text>
            Data de Entrega: {formatDate(editingActivity.deliveryDate)}
          </Text>
        )}
        <Button
          title="Selecionar Data"
          onPress={() => setShowDatePicker(true)}
        />

        <Button title="Salvar" onPress={handleUpdateActivity} />
        <Button title="Cancelar" onPress={() => router.back()} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
});
