import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { updateDepartment } from './_database';

/**
 * Een teller component voor één afdeling.
 * @param {Object} props
 * @param {string} props.departmentName - Naam van de afdeling.
 * @param {number} props.initialCount - De initiële telling (geladen door index.tsx).
 * @param {() => Promise<void>} props.onUpdate - Callback die wordt aangeroepen na elke succesvolle +1 of -1.
 */
export default function DepartmentCounter({ departmentName, initialCount, onUpdate }) {
  const [count, setCount] = useState(initialCount || 0);
  
  useEffect(() => {
    setCount(initialCount || 0);
  }, [initialCount]);
  
  const increment = async () => {
    try {
      const newCount = count + 1;
      setCount(newCount); 
      
      await updateDepartment(departmentName, newCount);
      
      if (onUpdate) onUpdate(); 
    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
      setCount(count); 
    }
  };
  
  const decrement = async () => {
    try {
      const newCount = Math.max(0, count - 1); 
      
      if (newCount === count) return;
      
      setCount(newCount); 
      
      await updateDepartment(departmentName, newCount);
      
      if (onUpdate) onUpdate(); 
    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
      setCount(count);
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
          disabled={count <= 0} 
        >
          <Text style={styles.buttonText}> -1 </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={increment} style={styles.button}>
          <Text style={styles.buttonText}> +1 </Text>
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