import { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import styles from './styleSheet.js';

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
    function handleReset()
    {
        setCount(0);
    }


    function toggleModal() {
    setModalVisible(!isModalVisible);
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

            <TouchableOpacity 
            onPress ={toggleModal}
            style = {[styles.button, styles.button_layout]}
            >
            <Text style ={styles.button_text}>Reset</Text>
            </TouchableOpacity>
            
            <Modal isVisible = {isModalVisible} onBackdropPress={toggleModal}>
                <View style= {styles.modal_content}>
                    <Text style = {styles.modal_text}>Close pop up content</Text>
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={styles.button_text}>Close pop up</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    );
}

export default DepartmentCounter;