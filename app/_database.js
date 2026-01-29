import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import 'react-native-url-polyfill/auto';


const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE3MX0.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let db = null;
let initPromise = null;

const initDatabase = async () => {
    if (db !== null) return db;
    if (initPromise !== null) return initPromise;

    initPromise = (async () => {
        try {
            const openedDb = await SQLite.openDatabaseAsync('myDatabase.db');
            if (!openedDb) throw new Error("Database kon niet worden geopend");
            
            db = openedDb;
            await db.execAsync('PRAGMA journal_mode = WAL;'); 
            return db;
        } catch (error) {
            initPromise = null; 
            throw error;
        }
    })();

    return initPromise;
};

export const createTables = async () => {
    const database = await initDatabase();
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS departments (
            name TEXT PRIMARY KEY NOT NULL, 
            count INTEGER DEFAULT 0,
            last_updated TEXT
        );
    `);
};

export const getAllDepartments = async () => {
    const database = await initDatabase();
    return await database.getAllAsync('SELECT name, count, last_updated FROM departments ORDER BY name');
};

export const addDepartment = async (name) => {
    const database = await initDatabase();
    const now = new Date().toISOString();
    

    await database.runAsync('INSERT INTO departments (name, count, last_updated) VALUES (?, 0, ?)', [name, now]);
    await supabase.from('HelpdeskDB').insert({ Name: name, Count: 0, Last_Updated: now });
};

export const updateDepartment = async (name, newCount) => {
    const database = await initDatabase();
    const now = new Date().toISOString();
    
    await database.runAsync('INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)', [name, newCount, now]);
    await supabase.from('HelpdeskDB').upsert({ Name: name, Count: newCount, Last_Updated: now }, { onConflict: 'Name' });
};


export const renameDepartment = async (oldName, newName) => {
    const database = await initDatabase();
    const now = new Date().toISOString();
    

    const { error } = await supabase
        .from('HelpdeskDB')
        .update({ Name: newName, Last_Updated: now })
        .eq('Name', oldName);

    if (error) {
        console.error("Supabase rename ging mis:", error);
        throw error;
    }
    

    await database.runAsync(
        'UPDATE departments SET name = ?, last_updated = ? WHERE name = ?', 
        [newName, now, oldName]
    );
};

export const deleteDepartment = async (name) => {
    const database = await initDatabase();
    

    await supabase.from('HelpdeskDB').delete().match({ Name: name });
    

    await database.runAsync('DELETE FROM departments WHERE name = ?', [name]);
};

export const syncAndCleanup = async () => {
    const database = await initDatabase();
    const { data, error } = await supabase.from('HelpdeskDB').select('Name, Count, Last_Updated');
    
    if (error) {
        console.error("Sync error:", error);
        return;
    }

    if (data) {
        const remoteNames = data.map(item => item.Name);
        const allLocal = await database.getAllAsync('SELECT name FROM departments');
        
  
        for (const local of allLocal) {
            if (!remoteNames.includes(local.name)) {
                await database.runAsync('DELETE FROM departments WHERE name = ?', [local.name]);
            }
        }


        for (const item of data) {
            await database.runAsync(
                'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
                [item.Name, item.Count, item.Last_Updated]
            );
        }
  
   }
};