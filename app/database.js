import * as SQLite from 'expo-sqlite';

let db = null;

// Database initialiseren
const initDatabase = async () => {
  if (!db) {
    try {
      db = await SQLite.openDatabaseAsync('myDatabase.db');
      console.log('Database geopend');
    } catch (error) {
      console.error("Error while opening database:", error);
      // Maak een mock database voor fallback
      db = {
        execAsync: async () => console.warn("Database functions are disabled."),
        getAllAsync: async () => [],
        getFirstAsync: async () => null,
        runAsync: async () => console.warn("Database functions are disabled.")
      };
    }
  }
  return db;
};

// Tabellen aanmaken
export const createTables = async () => {
  const database = await initDatabase();
  
  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS departments (
        name TEXT PRIMARY KEY NOT NULL, 
        count INTEGER
      );
    `);
    console.log('Tabellen aangemaakt');
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Department ophalen
export const getDepartment = async (name) => {
  const database = await initDatabase();
  
  try {
    const result = await database.getFirstAsync(
      'SELECT count FROM departments WHERE name = ?',
      [name]
    );
    
    return result ? result.count : 0;
  } catch (error) {
    console.error("Error getting department:", error);
    return 0;
  }
};

// Department updaten
export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  
  try {
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count) VALUES (?, ?)',
      [name, newCount]
    );
    console.log(`Department ${name} updated to ${newCount}`);
  } catch (error) {
    console.error("Error updating department:", error);
  }
};

// Alle departments ophalen (bonus functie)
export const getAllDepartments = async () => {
  const database = await initDatabase();
  
  try {
    const results = await database.getAllAsync(
      'SELECT * FROM departments ORDER BY name'
    );
    return results;
  } catch (error) {
    console.error("Error getting all departments:", error);
    return [];
  }
};