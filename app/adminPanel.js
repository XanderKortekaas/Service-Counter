import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert, Dimensions, FlatList,
    Modal,
    Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
// Voeg renameDepartment toe aan de imports
import { createTables, deleteDepartment, getAllDepartments, renameDepartment } from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width;

const AdminPanel = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState({ oldName: '', newName: '' });
    
    // ... overige states (mode, date, etc.) behouden zoals ze waren ...
    const [mode, setMode] = useState('current'); 
    const [date, setDate] = useState(new Date()); 
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); 
    const [endDate, setEndDate] = useState(new Date()); 
    const [showPicker, setShowPicker] = useState(false);
    const [pickerType, setPickerType] = useState('date'); 

    const loadDepartments = useCallback(async () => {
        try {
            await createTables(); 
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Fout bij laden:", error);
        }
    }, []);

    useEffect(() => { loadDepartments(); }, [loadDepartments]);

    const handleRename = async () => {
        if (!selectedDept.newName.trim() || selectedDept.newName === selectedDept.oldName) {
            setShowEditModal(false);
            return;
        }
        try {
            await renameDepartment(selectedDept.oldName, selectedDept.newName.trim());
            setShowEditModal(false);
            await loadDepartments();
        } catch (error) {
            Alert.alert("Fout", "Kon de naam niet aanpassen.");
        }
    };

    const renderHeader = () => (
        <View>
            <View style={{ flexDirection: 'row', padding: 15, gap: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button_layout, { flex: 1, backgroundColor: color.GRAY_700, borderColor: color.GRAY_500 }]}>
                    <Text style={styles.button_text}>Terug</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowAddModal(true)} style={[styles.button_layout, { flex: 1.5, backgroundColor: color.VIOLET_500, borderColor: color.VIOLET_500 }]}>
                    <Text style={[styles.button_text, { color: 'white' }]}>+ AFDELING</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={loadDepartments} style={[styles.button_layout, { flex: 1, backgroundColor: color.GRAY_700, borderColor: color.BLUE_700 }]}>
                    <Text style={[styles.button_text, { color: color.BLUE_700 }]}>Ververs</Text>
                </TouchableOpacity>
            </View>
            {/* ... BarChart en Filters blijven hetzelfde ... */}
        </View>
    );

    return (
        <SafeAreaView style={styles.style}>
            <FlatList
                data={departments}
                keyExtractor={(item) => item.name}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.container}> 
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={styles.counterContainer}>
                            <Text style={styles.countText}>{item.count}</Text>
                        </View>
                        
                        {mode === 'current' && (
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setSelectedDept({ oldName: item.name, newName: item.name });
                                        setShowEditModal(true);
                                    }}
                                    style={[styles.counterButton, { backgroundColor: color.BLUE_700, flex: 1 }]}
                                >
                                    <Text style={styles.buttonText}>Bewerken</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => deleteDepartment(item.name).then(loadDepartments)}
                                    style={[styles.counterButton, styles.buttonRed, { flex: 1 }]}
                                >
                                    <Text style={styles.buttonText}>Verwijderen</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />

            {/* Modal voor Hernoemen */}
            <Modal visible={showEditModal} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Naam Wijzigen</Text>
                        <TextInput 
                            style={styles.input} 
                            value={selectedDept.newName} 
                            onChangeText={(text) => setSelectedDept({...selectedDept, newName: text})}
                            autoFocus
                        />
                        <View style={styles.button_group}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowEditModal(false)}>
                                <Text style={styles.buttonText}>Annuleren</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleRename}>
                                <Text style={styles.buttonText}>Opslaan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            {/* Voeg hier je bestaande AddDepartmentModal en DateTimePicker toe */}
        </SafeAreaView>
    );
};

export default AdminPanel;