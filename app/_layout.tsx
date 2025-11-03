// app/_layout.tsx

import { Stack } from "expo-router";
import React, { useEffect } from 'react';


// Als 'database.js' in de root staat (buiten de 'app' map), is '../database' juist.
import { createTables } from './_database';

export default function RootLayout() {
  
  // Deze 'useEffect' runt één keer als de app start
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // We roepen de functie aan die de tabellen aanmaakt (als ze nog niet bestaan)
        await createTables();
        console.log("Database en tabellen zijn succesvol geïnitialiseerd.");
      } catch (error) {
        console.error("Fout bij initialiseren database in _layout:", error);
      }
    };

    // Start de initialisatie
    initializeDatabase();
  }, []); // De lege array [] betekent "run dit maar één keer"

  // Nu de database (op de achtergrond) start, laadt de rest van je app
  return <Stack />;
}