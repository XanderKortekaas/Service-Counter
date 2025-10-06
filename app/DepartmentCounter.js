
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { createTables, getDepartment, updateDepartment } from './database';
import Modal from 'react-native-modal';
import { useState } from 'react';


  useEffect(() => {
    createTables();
    getDepartment(departmentName, setCount);
  }, []);


function DepartmentCounter({departmentName})
{
    const [count, setCount] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
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
    <View style={{ margin: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>{departmentName}</Text>
      <Text style={{ fontSize: 32 }}>{count}</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button title="-" onPress={handleDecrement} />
        <View style={{ width: 20 }} />
        <Button title="+" onPress={handleIncrement} />
      </View>

            <TouchableOpacity 
            onPress ={toggleModal}
            style = {[styles.button, styles.button_layout]}
            >
            <Text style ={styles.button_text}>Reset</Text>
            </TouchableOpacity>
            
            <Modal isVisible = {isModalVisible} onBackdropPress={toggleModal}>
                <View style= {styles.modal_content}>
                    <Text style = {styles.modal_text}>Do You Want to Reset the Count?</Text>
                    <TouchableOpacity onPress={handleReset} style={styles.modal_button}>
                        <Text style={styles.button_text}>Reset Counter</Text>
                    </TouchableOpacity>
                    <Text style = {styles.modal_text}>Close pop up content</Text>
                </View>
            </Modal>

    </View>
  );
}

export default DepartmentCounter;