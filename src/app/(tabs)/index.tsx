import { ListItem } from "@/components/activities/ListItem";
import { ITEMS_PER_PAGE } from "@/constants/default/defaultValues";
import { Activity, useActivitiesDatabase } from "@/database/useDatabase";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { FAB, Searchbar } from "react-native-paper";
import { useTheme } from "../hooks/useTheme";

export default function ActivitiesScreen() {
  const activitiesDatabase = useActivitiesDatabase();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [searchQuery, isFocused]);

  // Função para carregar mais atividades
  const loadMoreActivities = useCallback(async () => {
    if (loadingMore || activities.length < ITEMS_PER_PAGE) return;

    setLoadingMore(true);
    try {
      const newActivities = await activitiesDatabase.readPaginated(
        page + 1,
        ITEMS_PER_PAGE
      );
      // Verifica se há mais atividades para carregar
      if (newActivities.length > 0) {
        setActivities([...activities, ...newActivities]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Erro ao carregar mais atividades:", error);
      Alert.alert("Erro", "Ocorreu um erro ao carregar mais atividades.");
    } finally {
      setLoadingMore(false);
    }
  }, [activities, loadingMore, page]);

  async function loadActivities() {
    try {
      if (searchQuery) {
        setActivities(await activitiesDatabase.search(searchQuery));
      } else {
        setActivities(
          await activitiesDatabase.readPaginated(1, ITEMS_PER_PAGE)
        );
        setPage(1);
      }
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      Alert.alert("Erro", "Ocorreu um erro ao carregar as atividades.");
    }
  }

  function handleCreateActivity() {
    router.push("/create/activity/");
  }

  function handleShowDetails(id: string) {
    router.push(`/details/activity/${id}`);
  }

  async function handleDeleteActivity(id: string) {
    try {
      await activitiesDatabase.remove(id);
      loadActivities(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      Alert.alert("Erro", "Ocorreu um erro ao excluir a atividade.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Searchbar
        placeholder="Pesquisar atividades..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        inputMode="search"
      />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <ListItem
            activity={item}
            onDelete={handleDeleteActivity}
            handleShowDetails={handleShowDetails}
            onEdit={() => router.push(`/edit/activity/${item.id}`)}
          />
        )}
        onEndReached={loadMoreActivities} // Carrega mais itens quando chegar ao final da lista
        onEndReachedThreshold={0.1} // Define a distância do final para carregar mais itens (10% nesse caso)
        ListFooterComponent={<Text>{loadingMore ? "Carregando..." : ""}</Text>}
      />

      <View style={styles.addButton}>
        <FAB icon="plus" onPress={handleCreateActivity} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  pageInfo: {
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
