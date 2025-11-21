import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { updateDepartmentCount } from './_database';
import styles from './_styleSheet';

function DepartmentCounter({ departmentName, initialCount, onUpdate }) {
  
  const [count, setCount] = useState(initialCount || 0);
  const [isModalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);


  async function handleIncrement() {
    const newCount = count + 1;
    setCount(newCount);
    await updateDepartmentCount(departmentName, newCount); 
  }

  async function handleDecrement() {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      await updateDepartmentCount(departmentName, newCount);
      if (onUpdate) onUpdate();
    }
  }

  async function handleReset() {
    setCount(0);
    await updateDepartmentCount(departmentName, 0); 
    toggleModal();
  }

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }

  return (
   <View style={[styles.counter_container, styles.style]}>
      <Text style={styles.department_name_text}>{departmentName}: {count}</Text>
      
      <View style = {styles.button_group}>
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
        
        <TouchableOpacity 
          onPress={toggleModal}
          style={[styles.button, styles.button_layout]}
        >
        <Text style={styles.button_text}>reset</Text> 
        </TouchableOpacity>
      </View>
        
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modal_content}>
          <Text style={styles.modal_text}>Wil je de teller resetten?</Text>
          
          <TouchableOpacity onPress={handleReset} style={[styles.modal_button, styles.button]}>
            <Text style={styles.modal_button_text}>Reset Teller</Text>
          </TouchableOpacity>

          <Text style={[styles.modal_text, { marginTop: 15, fontSize: 12 }]}>
            Klik op de achtergrond om te sluiten.
          </Text>
        </View>
      </Modal>
    </View>
  );
}

export default React.memo(DepartmentCounter);