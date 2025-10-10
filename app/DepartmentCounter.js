
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { createTables, getDepartment, updateDepartment } from './database';
import styles from './styleSheet';


function DepartmentCounter({ departmentName }) {
  const [count, setCount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    createTables();
    getDepartment(departmentName, setCount);
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
        {/*Decrease */}

        <TouchableOpacity 
          onPress={handleDecrement}
          style={[styles.button, styles.button_layout]} 
        >
        <Text style={styles.button_text}>-</Text>
        </TouchableOpacity>
        
        {/* Increase */}
        
        <TouchableOpacity 
         onPress={handleIncrement}
          style={[styles.button, styles.button_layout]}
        >
          <Text style={styles.button_text}>+</Text>
        </TouchableOpacity>
        
        {/* Reset */}

        <TouchableOpacity 
          onPress={toggleModal}
          style={[styles.button, styles.button_layout]}
        >
        <Text style={styles.button_text}>reset</Text> 
        </TouchableOpacity>
      </View>
        
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modal_content}>
          <Text style={styles.modal_text}>Do You Want to Reset the Count?</Text>

          <TouchableOpacity onPress={toggleModal}> 
            
            <TouchableOpacity onPress={handleReset} style={[styles.modal_button, styles.button]}>
            
            <Text style={styles.modal_button_text}>Reset Counter</Text>

            </TouchableOpacity>

          </TouchableOpacity>
          
          <Text style={styles.modal_text}>Click any where to close pop up content</Text>
        </View>
    </Modal>
  </View>
  );
}

export default DepartmentCounter;