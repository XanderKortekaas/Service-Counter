import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { updateDepartment } from './_database'; // getDepartment is niet meer nodig

// initialCount en onUpdate toegevoegd
export default function DepartmentCounter({ departmentName, initialCount, onUpdate }) { 
  // Gebruik de prop initialCount (of 0) als startwaarde
  const [count, setCount] = useState(initialCount || 0);

  // Zorg ervoor dat de state wordt bijgewerkt wanneer de prop verandert (bij laden/verversen)
  useEffect(() => {
    setCount(initialCount || 0);
  }, [initialCount]);
  

  const increment = async () => {
    try {
      const newCount = count + 1;
      setCount(newCount); 
      
      await updateDepartment(departmentName, newCount);
      
      // Roep de callback aan om de totale telling bij te werken op de indexpagina
      if (onUpdate) onUpdate(); 

    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
    }
  };

  const decrement = async () => {
    try {
      const newCount = Math.max(0, count - 1); 
      setCount(newCount); 
      
      await updateDepartment(departmentName, newCount);
      
      // Roep de callback aan
      if (onUpdate) onUpdate(); 

    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{departmentName}</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
            onPress={decrement} 
            style={[styles.button, styles.buttonRed]}
            disabled={count <= 0} // Knop uitschakelen als telling 0 is
        >
            <Text style={styles.buttonText}>-1</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={increment} style={styles.button}>
            <Text style={styles.buttonText}>+1 Stem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#2e78b7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonRed: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});