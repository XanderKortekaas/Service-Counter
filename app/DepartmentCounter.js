import React, { memo, useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { updateDepartment } from './_database';
import styles from "./_styleSheet";

const DepartmentCounter = ({ departmentName, initialCount, onUpdate }) => {
  const [count, setCount] = useState(initialCount || 0);
  
  useEffect(() => {
    setCount(initialCount || 0);
  }, [initialCount]);
  
  const increment = useCallback(async () => {
    const prevCount = count;
    const newCount = prevCount + 1;
    
    setCount(newCount); 
    
    try {
      await updateDepartment(departmentName, newCount);
      if (onUpdate) onUpdate(); 
    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
      setCount(prevCount); 
    }
  }, [count, departmentName, onUpdate]);
  
  const decrement = useCallback(async () => {
    const prevCount = count;
    const newCount = Math.max(0, prevCount - 1); 
    
    if (newCount === prevCount) return;
    
    setCount(newCount); 
    
    try {
      await updateDepartment(departmentName, newCount);
      if (onUpdate) onUpdate(); 
    } catch (error) {
      console.error(`❌ Kon ${departmentName} niet opslaan:`, error);
      setCount(prevCount);
    }
  }, [count, departmentName, onUpdate]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{departmentName}</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      
      <View style={styles.button_layout}>
        <TouchableOpacity 
          onPress={increment} 
          style={styles.counterButton}
        >
          <Text style={styles.buttonText}> +1 </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={decrement} 
          style={[styles.counterButton, styles.buttonRed]}
          disabled={count <= 0} 
        >
          <Text style={styles.buttonText}> -1 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(DepartmentCounter);