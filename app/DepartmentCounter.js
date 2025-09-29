import { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import styles from './styleSheet.js';

function DepartmentCounter({departmentName})
{
    const [count, setCount] = useState(0);
    
      function handleIncrement()
      {
        setCount(count + 1);
      }
    
      function handleDecrement()
      {
        if(count >0)
        {
          setCount(count -1);
        }
    }

    return (
        <View style={styles.counter_container}>
            <Text style={styles.counter_section_h1}>
                {departmentName}: {count}
            </Text>

            <TouchableOpacity 
                onPress={handleDecrement} 
                style={[styles.button, styles.button_layout]}
            >
                <Text style={styles.button_text}>-</Text>
            </TouchableOpacity>
        
            <TouchableOpacity 
                onPress={handleIncrement} 
                style={[styles.button, styles.button_layout]}
            >
                <Text style={styles.button_text}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

export default DepartmentCounter;