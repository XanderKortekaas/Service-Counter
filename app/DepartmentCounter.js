
import React, { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
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

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }

  function handleReset() {
    setCount(0);
    updateDepartment(departmentName, 0);
    toggleModal();
  }

  return (
    <View style={{ margin: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>{departmentName}</Text>
      <Text style={{ fontSize: 32 }}>{count}</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button title="-" onPress={handleDecrement} />
        <View style={{ width: 20 }} />
        <Button title="+" onPress={handleIncrement} />
      </View>
      <TouchableOpacity onPress={toggleModal} style={[styles.button, styles.button_layout]}>
        <Text style={styles.button_text}>Reset</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modal_content}>
          <Text style={styles.modal_text}>Do You Want to Reset the Count?</Text>
          <TouchableOpacity onPress={handleReset} style={styles.modal_button}>
            <Text style={styles.button_text}>Reset Counter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.modal_text}>Close pop up content</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default DepartmentCounter;