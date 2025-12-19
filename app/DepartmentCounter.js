import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { updateDepartment } from './_database';
import styles from "./_styleSheet";

/**
 * Een teller component voor één afdeling.
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
      {/* 'title' is behouden als naam in het stylesheet voor de afdelingsnaam */}
      <Text style={styles.title}>{departmentName}</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          onPress={decrement} 
          style={[styles.counterButton, styles.buttonRed]}
          disabled={count <= 0} 
        >
          <Text style={styles.buttonText}> -1 </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={increment} 
          style={styles.counterButton}
        >
          <Text style={styles.buttonText}> +1 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}