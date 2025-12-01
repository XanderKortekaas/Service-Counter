import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import styles from './_styleSheet';
// Importeer de database functies
import { createTables, syncAndCleanup } from './database';

export default function Index() {

  // Zodra de app opstart:
  useEffect(() => {
    const startUp = async () => {
      console.log("🚀 App start op...");
      
      try {
        // 1. Maak tabellen als ze niet bestaan
        await createTables();
        
        // 2. Sync met Supabase (haal nieuw binnen, gooi oud weg)
        await syncAndCleanup();
      } catch (error) {
        // Vang fouten op zodat de app niet crasht
        console.error("⚠️ Oeps, er ging iets mis bij het opstarten:", error);
      }
    };

    startUp();
  }, []); 

  return (
    <View style={[styles.style, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Header Sectie */}
        <View style={styles.app_header_container}>
          <Text style={styles.app_header_text}>
            Welcome to the Christelijke Hogeschool Ede
          </Text>
          
          <Link href="/adminPanel" asChild>
            <TouchableOpacity style={styles.modal_button}>
              <Text style={styles.button_text}>Admin Panel</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Department Lijst */}
        <View style={styles.counter_container}>
          <DepartmentCounter departmentName="IT" />
          <DepartmentCounter departmentName="Finance" />
          <DepartmentCounter departmentName="Internal Affairs" />
        </View>

      </ScrollView>
    </View>
  );
}