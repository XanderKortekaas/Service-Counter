import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE3MX0.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let db = null;

const initDatabase = async () => {
    if (db) return db;
    
    try {
        db = await SQLite.openDatabaseAsync('myDatabase.db');
        await db.execAsync('PRAGMA journal_mode = WAL;'); 
        return db;
    } catch (error) {
        db = null; 
        console.error("❌ Fout bij openen database:", error);
        throw error;
    }
};

export const getAllDepartments = async () => {
    try {
        const database = await initDatabase();
        // Gebruik getFirstAsync of getAllAsync direct na init
        return await database.getAllAsync('SELECT name, count, last_updated FROM departments ORDER BY name'); 
    } catch (e) {
        console.error("Fout bij ophalen departments:", e);
        return [];
    }
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

export const renameDepartment = async (oldName, newName) => {
  const database = await initDatabase();
  const now = new Date().toISOString();
  try {
    // 1. Update lokaal in SQLite
    await database.runAsync(
      'UPDATE departments SET name = ?, last_updated = ? WHERE name = ?',
      [newName, now, oldName]
    );

    // 2. Update in Supabase (we deleten de oude en voegen de nieuwe toe om primaire sleutel fouten te voorkomen)
    const { data: existingData } = await supabase
      .from('HelpdeskDB')
      .select('Count')
      .eq('Name', oldName)
      .single();

    if (existingData) {
      await supabase.from('HelpdeskDB').delete().match({ Name: oldName });
      await supabase.from('HelpdeskDB').insert({ 
        Name: newName, 
        Count: existingData.Count, 
        Last_Updated: now 
      });
    }
  } catch (error) {
    console.error(`❌ Fout bij hernoemen van ${oldName}:`, error);
    throw error;
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