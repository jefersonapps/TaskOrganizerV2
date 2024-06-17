import { useSQLiteContext } from "expo-sqlite";

export type PriorityLevel = "high" | "medium" | "low";

export type Activity = {
  id: string;
  title: string;
  content: string;
  priority: PriorityLevel;
  deliveryDate: string | null;
  checked: boolean;
};

export function useActivitiesDatabase() {
  const database = useSQLiteContext();

  async function resetDatabase() {
    try {
 
        await database.execAsync(`DROP TABLE IF EXISTS activities`);
        await database.execAsync(`DROP TABLE IF EXISTS schedule`);
        await database.execAsync(`DROP TABLE IF EXISTS files`);
        await database.execAsync(`DROP TABLE IF EXISTS latex`);

  
      console.log('Banco de dados zerado com sucesso!');
    } catch (error) {
      console.error('Erro ao zerar o banco de dados:', error);
    }
  }

  async function create(activity: Activity): Promise<void> {
    const query = `
      INSERT INTO activities (id, title, content, priority, deliveryDate, checked)
      VALUES ($id, $title, $content, $priority, $deliveryDate, $checked)
    `;
    const statement = await database.prepareAsync(query);
    try {
      await statement.executeAsync({
        $id: activity.id,
        $title: activity.title,
        $content: activity.content,
        $priority: activity.priority,
        $deliveryDate: activity.deliveryDate,
        $checked: activity.checked ? 1 : 0,
      });
    } catch (error) {
      throw error;
    }
  }

  async function readPaginated(
    page: number,
    pageSize: number = 20
  ): Promise<Activity[]> {
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT * FROM activities
      LIMIT $pageSize OFFSET $offset
    `;
    const statement = await database.prepareAsync(query);
    try {
      const result = await statement.executeAsync({
        $pageSize: pageSize,
        $offset: offset,
      });

      const activities = (await result.getAllAsync()) as Activity[];
      return activities.map((activity) => ({
        ...activity,
        checked: !!activity.checked, 
        deliveryDate: activity.deliveryDate ? activity.deliveryDate : null, 
      }));
    } catch (error) {
      throw error;
    }
  }

  async function search(searchQuery: string): Promise<Activity[]> {
    const query = "SELECT * FROM activities WHERE title LIKE ? OR content LIKE ?";
  
    try {
      const response = await database.getAllAsync<Activity>(
        query,
        `%${searchQuery}%`,
        `%${searchQuery}%`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function update(activity: Activity): Promise<void> {
    const query = `
      UPDATE activities
      SET title = $title, content = $content, priority = $priority, deliveryDate = $deliveryDate, checked = $checked
      WHERE id = $id
    `;
    const statement = await database.prepareAsync(query);
    try {
      await statement.executeAsync({
        $id: activity.id,
        $title: activity.title,
        $content: activity.content,
        $priority: activity.priority,
        $deliveryDate: activity.deliveryDate,
        $checked: activity.checked ? 1 : 0,
      });
    } catch (error) {
      throw error;
    }
  }

  async function remove(id: string): Promise<void> {
    const query = `
      DELETE FROM activities
      WHERE id = $id
    `;
    const statement = await database.prepareAsync(query);
    try {
      await statement.executeAsync({ $id: id });
    } catch (error) {
      throw error;
    }
  }

  async function findById(id: string): Promise<Activity | null> {
    const query = "SELECT * FROM activities WHERE id = $id";
    const statement = await database.prepareAsync(query);

    try {
      const result = await statement.executeAsync({ $id: id });
      const activity = (await result.getFirstAsync()) as Activity | undefined;

      return activity || null;
    } catch (error) {
      console.error("Erro ao buscar atividade por ID:", error);
      throw error;
    }
  }

  return { create, readPaginated, update, remove , search, resetDatabase, findById};
}


export type Theme = 'light' | 'dark' | 'system'

export type UserData = {
  theme: Theme;
  palette: any;
  avatar: string;
  name: string;
  security: boolean
}

export function useConfigDatabase() {

  const database = useSQLiteContext();
  
  async function setUserData(userData: UserData): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO settings (id, theme, palette, avatar, name, security)
      VALUES ((SELECT id FROM settings LIMIT 1), $theme, $palette, $avatar, $name, $security)
    `;
    const statement = await database.prepareAsync(query);
    try {
      await statement.executeAsync({
        $theme: userData.theme,
        $palette: userData.palette,
        $avatar: userData.avatar, 
        $name: userData.name,
        $security: userData.security ? 1 : 0,
      });
      console.log("Dados de usuário salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados de usuário:", error);
      throw error;
    }
  }
  
  
  async function getTheme(): Promise<Theme | null> {
    const query = "SELECT * FROM settings";
    try {
      const result = await database.getFirstAsync<UserData>(query);
      console.log('Resultado da consulta:', result); // Verifique o formato do resultado no console
      if (result?.theme) {

        return result.theme
      }
      return null
    } catch (error) {
      console.error("Erro ao obter o tema:", error);
      return null; // Retorna null em caso de erro
    }
  }
  
  


  return {getTheme, setUserData}
}