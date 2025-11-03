import * as SQLite from 'expo-sqlite';

let db = null;

/**
 * Initialiseert de database. Zorgt ervoor dat de database slechts één keer wordt geopend.
 * Biedt een mock-fallback als de database niet kan openen om crashes te voorkomen.
 */
const initDatabase = async () => {
  if (!db) {
    try {
      // Gebruikt de nieuwe async API voor Expo SQLite
      db = await SQLite.openDatabaseAsync('myDatabase.db');
      console.log('Database geopend');
    } catch (error) {
      console.error("Fout bij het openen van de database:", error);
      // Mock-implementatie als fallback (slaat niks op, maar voorkomt crashes)
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

/**
 * Maakt de 'departments' tabel aan als deze nog niet bestaat.
 * Wordt één keer aangeroepen bij de start van de app (in _layout.tsx).
 */
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

/**
 * Haalt de huidige count van een department op.
 * @param {string} name - De naam van het department.
 * @returns {Promise<number>} De opgeslagen count, of 0 als het department nog niet bestaat.
 */
export const getDepartment = async (name) => {
  const database = await initDatabase();
  
  try {
    const result = await database.getFirstAsync(
      'SELECT count FROM departments WHERE name = ?',
      [name]
    );
    
    // Geeft de count terug, of 0 als de rij niet bestaat
    return result ? result.count : 0;
  } catch (error) {
    console.error(`Fout bij ophalen department ${name}:`, error);
    return 0;
  }
};

/**
 * Werkt de count van een department bij of voegt deze toe als hij nieuw is.
 * @param {string} name - De naam van het department.
 * @param {number} newCount - De nieuwe count.
 */
export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  
  try {
    // INSERT OR REPLACE: update de rij als 'name' al bestaat (PRIMARY KEY)
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count) VALUES (?, ?)',
      [name, newCount]
    );
    console.log(`Department ${name} geüpdatet naar ${newCount}`);
  } catch (error) {
    console.error(`Fout bij updaten department ${name}:`, error);
  }
};

/**
 * Haalt alle departments op (handig voor debugging).
 * @returns {Promise<Array<{name: string, count: number}>>} Lijst van alle departments.
 */
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