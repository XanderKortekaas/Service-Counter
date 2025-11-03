import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
// BELANGRIJK: 'createTables' is verwijderd uit de import, die wordt nu in _layout.tsx gerund
// FIX: Het pad is aangepast van './database' naar './_database' om de Expo Router waarschuwing te verhelpen
import { getDepartment, updateDepartment } from './_database';
import styles from './_styleSheet';


function DepartmentCounter({ departmentName }) {
  const [count, setCount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  // Zorgt ervoor dat de opgeslagen data geladen wordt als de component laadt
  useEffect(() => {
    // We maken een async functie aan om de database op te halen
    const loadSavedCount = async () => {
      try {
        // Wacht (await) op de opgeslagen count van dit department
        const savedCount = await getDepartment(departmentName);
        
        // Update de state met de geladen waarde
        setCount(savedCount);
        console.log(`[${departmentName}] Opgeslagen count geladen: ${savedCount}`);

      } catch (error) {
        console.error(`Fout bij het laden van department ${departmentName}:`, error);
        // Zet de count op 0 bij een fout
        setCount(0); 
      }
    };
    
    // Roep de async functie aan
    loadSavedCount();

  }, [departmentName]); // Herlaadt als de departmentName verandert

  function handleIncrement() {
    const newCount = count + 1;
    setCount(newCount);
    // Sla de nieuwe waarde op in de database
    updateDepartment(departmentName, newCount); 
  }

  function handleDecrement() {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      // Sla de nieuwe waarde op in de database
      updateDepartment(departmentName, newCount);
    }
  }

  function handleReset() {
    setCount(0);
    // Sla de reset waarde (0) op in de database
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
          <Text style={styles.modal_text}>Wil je de teller resetten?</Text>
          
          {/* De buitense TouchableOpacity is onnodig en is hierboven verwijderd */}
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
