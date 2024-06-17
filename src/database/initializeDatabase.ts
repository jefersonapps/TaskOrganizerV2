import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  try {
    // Activities table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('high', 'medium', 'low')) NOT NULL DEFAULT 'low',
        deliveryDate TEXT,
        checked INTEGER DEFAULT 0
      )
    `);

    // Schedule table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS schedule (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('high', 'medium', 'low')) NOT NULL DEFAULT 'low',
        deliveryDate TEXT,
        checked INTEGER DEFAULT 0,
        day TEXT CHECK(day IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')) NOT NULL
      )
    `);

    // Files table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY NOT NULL,
        uri TEXT NOT NULL 
      )
    `);

    // Latex table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS latex (
        id TEXT PRIMARY KEY NOT NULL,
        code TEXT NOT NULL
      )
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme TEXT NOT NULL DEFAULT 'system',
        palette TEXT NOT NULL,
        avatar TEXT NOT NULL,
        name TEXT NOT NULL,
        security INTEGER DEFAULT 0
      )
    `);    

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}