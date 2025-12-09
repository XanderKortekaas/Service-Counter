import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE3MX0.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';

// Supabase client initialisatie
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// SQLite database instantie
let db = null;

const initDatabase = async () => {
  if (!db) {
    try {
      // Gebruik openDatabaseAsync om de database te openen/creëren
      db = await SQLite.openDatabaseAsync('myDatabase.db');
      console.log('Local Database geopend');
    } catch (error) {
      console.error("Fout bij het openen van de database:", error);
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
        count INTEGER DEFAULT 0,
        last_updated TEXT
      );
    `);

    // Probeer de 'last_updated' kolom toe te voegen als deze nog niet bestaat (voor migratiedoeleinden)
    try {
        await database.execAsync('ALTER TABLE departments ADD COLUMN last_updated TEXT');
    } catch (e) {
        // Kolom bestaat al, of andere ALTER fout die genegeerd kan worden
    }

    console.log('Lokale tabellen gecontroleerd');
  } catch (error) {
    console.error("Fout bij aanmaken tabellen:", error);
  }
};

export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); 

  try {
    // 1. Lokale database updaten
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, newCount, now]
    );
    console.log(`Lokaal geüpdatet: ${name} -> ${newCount}`);

    // 2. Supabase synchroniseren
    const { error } = await supabase
      .from('HelpdeskDB') 
      .upsert(
        { 
          Name: name,          
          Count: newCount,     
          Last_Updated: now    
        },
        { onConflict: 'Name' }
      );

    if (error) {
        console.error("❌ HelpdeskDB Update Fout:", JSON.stringify(error, null, 2));
    } else {
      console.log("✅ Succes: Stand bijgewerkt in Supabase!");
    }

  } catch (error) {
    console.error(`Fout bij updaten department ${name}:`, error);
  }
};

export const getDepartment = async (name) => {
  const database = await initDatabase();
  try {
    const result = await database.getFirstAsync(
      'SELECT count FROM departments WHERE name = ?',
      [name]
    );
    if (result) return result.count;
    return 0; 
  } catch (error) {
    console.error(`Fout bij ophalen department ${name}:`, error);
    return 0;
  }
};

export const getAllDepartments = async () => {
  const database = await initDatabase();
  // Zorg ervoor dat de 'count' kolom wordt geselecteerd voor de Admin Panel weergave
  const results = await database.getAllAsync('SELECT name, count FROM departments ORDER BY name'); 
  return results;
};

export const syncAndCleanup = async () => {
  const database = await initDatabase();
  console.log("Start synchronisatie...");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Download de meest recente gegevens van Supabase (afgelopen 30 dagen)
  const { data, error } = await supabase
    .from('HelpdeskDB')
    .select('*')
    .gt('Last_Updated', thirtyDaysAgo.toISOString()); 
    
  if (error) {
    console.error("Fout bij synchronisatie met Supabase:", error);
  }

  // 2. Data samenvoegen/overschrijven in lokale DB
  if (data && data.length > 0) {
    for (const item of data) {
      await database.runAsync(
        'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
        [item.Name, item.Count, item.Last_Updated]
      );
    }
    console.log(`${data.length} items gedownload.`);
  }

  // 3. Oude data lokaal opschonen
  await database.runAsync(
    'DELETE FROM departments WHERE last_updated < ?',
    [thirtyDaysAgo.toISOString()]
  );
  console.log("Oude data opgeschoond.");
};

// ===========================================
// NIEUWE FUNCTIES VOOR ADMIN PANEL & INDEX
// ===========================================

export const addDepartment = async (name) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); 
  
  try {
    // Voeg toe aan lokale SQLite DB
    await database.runAsync(
      'INSERT INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, 0, now] // Start met count 0
    );

    // Voeg toe aan Supabase
    const { error } = await supabase
      .from('HelpdeskDB') 
      .insert(
        { 
            Name: name,          
            Count: 0,     
            Last_Updated: now    
        },
      );

    if (error) {
      // Rol terug als Supabase faalt (of gooi een fout om de gebruiker te waarschuwen)
      await database.runAsync('DELETE FROM departments WHERE name = ?', [name]);
      console.error("❌ HelpdeskDB Toevoegen Fout:", JSON.stringify(error, null, 2));
      throw new Error("Kon afdeling niet toevoegen aan Supabase. Deze naam bestaat mogelijk al.");
    } else {
      console.log(`✅ Succes: Afdeling ${name} toegevoegd!`);
    }

  } catch (error) {
    console.error(`Fout bij toevoegen department ${name}:`, error);
    throw error; 
  }
};

export const deleteDepartment = async (name) => {
  const database = await initDatabase();
  
  try {
    // Verwijder uit lokale SQLite DB
    await database.runAsync('DELETE FROM departments WHERE name = ?', [name]);

    // Verwijder uit Supabase
    const { error } = await supabase
      .from('HelpdeskDB') 
      .delete()
      .match({ Name: name });

    if (error) {
      console.error("❌ HelpdeskDB Verwijderen Fout:", JSON.stringify(error, null, 2));
      throw new Error("Kon afdeling niet verwijderen uit Supabase.");
    } else {
      console.log(`✅ Succes: Afdeling ${name} verwijderd!`);
    }

  } catch (error) {
    console.error(`Fout bij verwijderen department ${name}:`, error);
    throw error;
  }
};

export const getAllDepartmentNames = async () => {
  const database = await initDatabase();
  try {
    // Selecteer alleen de naam (nodig voor Index.tsx)
    const results = await database.getAllAsync('SELECT name FROM departments ORDER BY name'); 
    return results.map(item => item.name); 
  } catch (error) {
    console.error("Fout bij ophalen alle afdelingsnamen:", error);
    return [];
  }
};

export { db };
