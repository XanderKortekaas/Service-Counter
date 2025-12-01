import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';

// 1. SUPABASE CONFIGURATIE
// Let op: Voor een echte app is het veiliger om deze keys in een .env bestand te zetten,
// maar voor nu werkt dit prima om te testen.
const SUPABASE_URL = 'https://camsifkzljqvhccbvkyy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbXNpZmt6bGpxdmhjY2J2a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzkxNzEsImV4cCI6MjA4MDExNTE3MX0.htmoTRzz2ZUToee7EL2sZ6zNScQkHasR_lFB1EKbzPk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    // We maken alleen de 'departments' tabel lokaal. 
    // De 'logs' tabel bestaat ALLEEN in Supabase (want die is voor Power BI, niet voor de telefoon).
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS departments (
        name TEXT PRIMARY KEY NOT NULL, 
        count INTEGER DEFAULT 0,
        last_updated TEXT
      );
    `);
    console.log('Lokale tabellen gecontroleerd');
  } catch (error) {
    console.error("Fout bij aanmaken tabellen:", error);
  }
};

// --- DE HYBRIDE FUNCTIES ---

export const updateDepartment = async (name, newCount) => {
  const database = await initDatabase();
  const now = new Date().toISOString(); // Huidige tijd

  try {
    // STAP 1: Lokaal opslaan (SQLite) -> Zodat de app direct reageert voor de gebruiker
    await database.runAsync(
      'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
      [name, newCount, now]
    );
    console.log(`Lokaal geüpdatet: ${name} -> ${newCount}`);

    // STAP 2 & 3: Stuur naar Supabase (Server)
    // We maken twee beloftes (promises) aan die we tegelijk afvuren.
    
    // A. Update de huidige stand (zodat andere telefoons up-to-date zijn)
    const updatePromise = supabase
      .from('departments')
      .upsert({ name: name, count: newCount, last_updated: now });

    // B. Log de geschiedenis (Speciaal voor Power BI grafieken!)
    const logPromise = supabase
      .from('logs')
      .insert({ department_name: name, new_count: newCount, timestamp: now });

    // Vuur ze af! We wachten niet op het antwoord voor de UI update (fire & forget),
    // maar we loggen wel even of het gelukt is.
    Promise.all([updatePromise, logPromise]).then((results) => {
        const [updateRes, logRes] = results;
        
        if (updateRes.error) console.error("Supabase Update Error:", updateRes.error);
        if (logRes.error) console.error("Supabase Log Error:", logRes.error);
        
        if (!updateRes.error && !logRes.error) {
            console.log("Succes: Data gesynct én gelogd voor Power BI!");
        }
    });

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
    
    // Als we het lokaal vinden, prima.
    if (result) return result.count;

    return 0; 
  } catch (error) {
    console.error(`Fout bij ophalen department ${name}:`, error);
    return 0;
  }
};

export const getAllDepartments = async () => {
  const database = await initDatabase();
  // Haalt alleen op wat er NOG op de telefoon staat (dus de recente dingen)
  const results = await database.getAllAsync('SELECT * FROM departments ORDER BY name');
  return results;
};

// --- SCHOONMAAK & SYNC FUNCTIE ---
// Roep deze functie aan als de app opstart (in je App.js / index.tsx)

export const syncAndCleanup = async () => {
  const database = await initDatabase();
  
  console.log("Start synchronisatie...");

  // 1. Download recente data van Supabase (laatste 30 dagen)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .gt('last_updated', thirtyDaysAgo.toISOString()); // gt = greater than

  if (data && data.length > 0) {
    // Stop deze recente data in SQLite
    for (const item of data) {
      await database.runAsync(
        'INSERT OR REPLACE INTO departments (name, count, last_updated) VALUES (?, ?, ?)',
        [item.name, item.count, item.last_updated]
      );
    }
    console.log(`${data.length} recente items gedownload van server.`);
  } else if (error) {
      console.error("Kon niet downloaden van Supabase:", error);
  }

  // 2. OPRUIMEN: Gooi alles weg uit SQLite dat ouder is dan 30 dagen
  // Dit houdt de telefoon snel en licht. De geschiedenis staat veilig op Supabase.
  await database.runAsync(
    'DELETE FROM departments WHERE last_updated < ?',
    [thirtyDaysAgo.toISOString()]
  );
  console.log("Oude data van telefoon opgeschoond.");
};