import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { getDepartment, updateDepartment } from './_database';
import styles from './_styleSheet';

function DepartmentCounter({ departmentName }) {
  const [count, setCount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadSavedCount = async () => {
      try {
        const savedCount = await getDepartment(departmentName);
        setCount(savedCount);
        console.log(`[${departmentName}] Opgeslagen count geladen: ${savedCount}`);
      } catch (error) {
        console.error(`Fout bij het laden van department ${departmentName}:`, error);
        setCount(0); 
      }
    };
    
    loadSavedCount();
  }, [departmentName]);

  function handleIncrement() {
    const newCount = count + 1;
    setCount(newCount);
    updateDepartment(departmentName, newCount); 
  }

  function handleDecrement() {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateDepartment(departmentName, newCount);
    }
  }

  function handleReset() {
    setCount(0);
    updateDepartment(departmentName, 0); 
    toggleModal();
  }

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }

  return (
    <View style={styles.counter_container}>
      <Text style={styles.App_text}>{[departmentName,": " , count]}</Text>
      
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

          <Text style={styles.modal_text}>Klik ergens om dit pop-upvenster te sluiten</Text>
        </View>
      </Modal>
    </View>
  );
}

export default DepartmentCounter;
