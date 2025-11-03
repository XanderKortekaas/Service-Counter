import { Stack } from "expo-router";
import React, { useEffect } from 'react';

import { createTables } from './_database';

export default function RootLayout() {
  
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTables();
        console.log("Database en tabellen zijn succesvol geïnitialiseerd.");
      } catch (error) {
        console.error("Fout bij initialiseren database in _layout:", error);
      }
    };

    initializeDatabase();
  }, []);

  return <Stack />;
}
