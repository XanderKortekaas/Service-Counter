import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// We importeren jouw database functies
import { getDepartment, updateDepartment } from './database';

export default function DepartmentCounter({ departmentName }) {
  const [count, setCount] = useState(0);

  // 1. Bij het laden van de component: Haal de huidige stand uit SQLite
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(`🔍 Laden voor ${departmentName}...`);
        const savedCount = await getDepartment(departmentName);
        
        // Zorg dat we altijd een getal hebben, ook als de DB null teruggeeft
        setCount(savedCount || 0);
      } catch (error) {
        console.error(`⚠️ Fout bij laden ${departmentName}:`, error);
      }
    };
    loadData();
  }, [departmentName]);

  // 2. Als je op de knop drukt
  const increment = async () => {
    try {
      const newCount = count + 1;
      setCount(newCount); // Update scherm direct (lekker snel)
      
      console.log(`🆙 Updaten ${departmentName} naar ${newCount}...`);
      
      // Update de database op de achtergrond (SQLite + Supabase)
      await updateDepartment(departmentName, newCount);
    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
      // Optioneel: zet teller terug als het mislukt
      // setCount(count); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{departmentName}</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>

      <TouchableOpacity onPress={increment} style={styles.button}>
        <Text style={styles.buttonText}>+1 Stem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    // Schaduw voor een beetje diepte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  counterContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e78b7',
  },
  button: {
    backgroundColor: '#2e78b7',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});