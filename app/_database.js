import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
// LET OP: Het is veiliger om deze sleutel in een .env bestand te zetten, maar voor nu werkt dit.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE3MX0.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

let db = null;

const initDatabase = async () => {
  if (!db) {
    try {
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

    try {
        await database.execAsync('ALTER TABLE departments ADD COLUMN last_updated TEXT');
    } catch (e) {
        // Kolom bestaat waarschijnlijk al
    }

    console.log('Lokale tabellen gecontroleerd');
  } catch (error) {
    console.error("Fout bij aanmaken tabellen:", error);
  }
};

// --- FUNCTIES VOOR HET UPDATEN VAN DE LIVE STAND (JOUW CODE) ---

export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); 

  try {
    // 1. Update Lokaal (SQLite)
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, newCount, now]
    );
    console.log(`Lokaal geüpdatet: ${name} -> ${newCount}`);

    // 2. Update Live Supabase (HelpdeskDB)
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

// --- AANGEPASTE FUNCTIE VOOR LIJST & GRAFIEKEN ---

export const getAllDepartments = async (startDate = null, endDate = null) => {
  
  // SCENARIO 1: Historische data (via Datumkiezer in Grafiek scherm)
  if (startDate && endDate) {
      try {
          const startISO = startDate.toISOString();
          const endISO = endDate.toISOString();
          console.log(`🔍 Supabase Logs ophalen van ${startISO} tot ${endISO}`);

          // Haal logs op uit de 'Logs' tabel (Backup tabel)
          const { data, error } = await supabase
              .from('Logs') 
              .select('department_name, new_count, timestamp')
              .gte('timestamp', startISO)
              .lte('timestamp', endISO)
              .order('timestamp', { ascending: false });

          if (error) throw error;

          // Filter dubbele afdelingen eruit (pak de nieuwste in de selectie)
          const uniqueDepartments = {};
          data.forEach(row => {
              if (!uniqueDepartments[row.department_name]) {
                  uniqueDepartments[row.department_name] = {
                      // We mappen de Supabase kolomnamen naar de app namen
                      name: row.department_name,
                      count: row.new_count 
                  };
              }
          });

          return Object.values(uniqueDepartments);

      } catch (error) {
          console.error("Fout bij ophalen logs uit Supabase:", error);
          return [];
      }
  }

  // SCENARIO 2: Huidige data (Als er geen datums worden meegegeven)
  // Dit is handig als je oude code deze functie nog gebruikt zonder argumenten
  const database = await initDatabase();
  const results = await database.getAllAsync('SELECT * FROM departments ORDER BY name');
  return results;
};

// --- SYNCHRONISATIE (JOUW CODE) ---

export const syncAndCleanup = async () => {
  const database = await initDatabase();
  console.log("Start synchronisatie...");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('HelpdeskDB')
    .select('*')
    .gt('Last_Updated', thirtyDaysAgo.toISOString()); 

  if (data && data.length > 0) {
    for (const item of data) {
      await database.runAsync(
        'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
        [item.Name, item.Count, item.Last_Updated]
      );
    }
    console.log(`${data.length} items gedownload.`);
  }

  await database.runAsync(
    'DELETE FROM departments WHERE last_updated < ?',
    [thirtyDaysAgo.toISOString()]
  );
  console.log("Oude data opgeschoond.");
};

// Exporteer ook supabase zelf voor het geval dat
export { supabase };
