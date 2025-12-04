import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import { createTables, syncAndCleanup } from './_database';
import styles from './_styleSheet';

export default function Index() {

  useEffect(() => {
    const startUp = async () => {
      console.log("🚀 App start op...");
      
      try {
        await createTables();
        await syncAndCleanup();
      } catch (error) {
        console.error("⚠️ Oeps, er ging iets mis bij het opstarten:", error);
      }
    };

    startUp();
  }, []); 

  return (
    <View style={[styles.style, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
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

        <View style={styles.counter_container}>
          <DepartmentCounter departmentName="IT" />
          <DepartmentCounter departmentName="Finance" />
          <DepartmentCounter departmentName="Internal Affairs" />
        </View>

      </ScrollView>
    </View>
  );
}