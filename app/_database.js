import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE1MjV9.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';

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
      console.log('✅ Database succesvol geopend');
    } catch (error) {
      console.error("❌ Fout bij het openen van de database:", error);
      throw error;
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
    } catch (e) {}
  } catch (error) {
    console.error("Fout bij aanmaken tabellen:", error);
  }
};

export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); 
  try {
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, newCount, now]
    );
    await supabase
      .from('HelpdeskDB') 
      .upsert({ Name: name, Count: newCount, Last_Updated: now }, { onConflict: 'Name' });
  } catch (error) {
    console.error(`❌ Fout bij updaten ${name}:`, error);
    throw error;
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
    return 0;
  }
};

export const getAllDepartments = async (startTime = null, endTime = null) => {
  const database = await initDatabase();
  try {
    const results = await database.getAllAsync('SELECT name, count, last_updated FROM departments ORDER BY name'); 
    return results;
  } catch (e) {
    console.error("Fout bij ophalen departments:", e);
    return [];
  }
};

export const syncAndCleanup = async () => {
  const database = await initDatabase();
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
  }
  await database.runAsync(
    'DELETE FROM departments WHERE last_updated < ?',
    [thirtyDaysAgo.toISOString()]
  );
};

export const addDepartment = async (name) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); 
  try {
    await database.runAsync(
      'INSERT INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, 0, now]
    );
    const { error } = await supabase
      .from('HelpdeskDB') 
      .insert({ Name: name, Count: 0, Last_Updated: now });
    if (error) {
      await database.runAsync('DELETE FROM departments WHERE name = ?', [name]);
      throw new Error(error.message);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteDepartment = async (name) => {
  const database = await initDatabase();
  try {
    await database.runAsync('DELETE FROM departments WHERE name = ?', [name]);
    await supabase.from('HelpdeskDB').delete().match({ Name: name });
  } catch (error) {
    throw error;
  }
};