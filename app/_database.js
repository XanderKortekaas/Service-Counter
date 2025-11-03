import * as SQLite from 'expo-sqlite';

let db = null;

const initDatabase = async () => {
  if (!db) {
    try {
      db = await SQLite.openDatabaseAsync('myDatabase.db');
      console.log('Database geopend');
    } catch (error) {
      console.error("Fout bij het openen van de database:", error);
      db = {
        execAsync: async () => console.warn("Database functies zijn uitgeschakeld (Mock DB)."),
        getAllAsync: async () => [],
        getFirstAsync: async () => null,
        runAsync: async () => console.warn("Database functies zijn uitgeschakeld (Mock DB).")
      };
    }
  }
  return db;
};

export const createTables = async () => {
  const database = await initDatabase();
  
  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS departments (
        name TEXT PRIMARY KEY NOT NULL, 
        count INTEGER DEFAULT 0
      );
    `);
    console.log('Tabellen aangemaakt/gecontroleerd');
  } catch (error) {
    console.error("Fout bij aanmaken tabellen:", error);
  }
};

export const getDepartment = async (name) => {
  const database = await initDatabase();
  
  try {
    const result = await database.getFirstAsync(
      'SELECT count FROM departments WHERE name = ?',
      [name]
    );
    
    return result ? result.count : 0;
  } catch (error) {
    console.error(`Fout bij ophalen department ${name}:`, error);
    return 0;
  }
};

export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  
  try {
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count) VALUES (?, ?)',
      [name, newCount]
    );
    console.log(`Department ${name} geüpdatet naar ${newCount}`);
  } catch (error) {
    console.error(`Fout bij updaten department ${name}:`, error);
  }
};

export const getAllDepartments = async () => {
  const database = await initDatabase();
  
  try {
    const results = await database.getAllAsync(
      'SELECT * FROM departments ORDER BY name'
    );
    return results;
  } catch (error) {
    console.error("Fout bij ophalen alle departments:", error);
    return[];
  }
};
