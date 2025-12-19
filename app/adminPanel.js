import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { addDepartment, createTables, deleteDepartment, getAllDepartments } from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width;

const AddDepartmentModal = ({ visible, onClose, onAdd }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleAdd = async () => {
        if (!departmentName.trim()) return;
        setLoading(true);
        try {
            await onAdd(departmentName.trim());
            setDepartmentName('');
            onClose();
        } catch (error) {
            Alert.alert('Fout', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Nieuwe Afdeling</Text>
                    <TextInput style={styles.input} value={departmentName} onChangeText={setDepartmentName} autoFocus />
                    <View style={styles.button_group}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}><Text style={styles.buttonText}>Annuleren</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAdd}><Text style={styles.buttonText}>Toevoegen</Text></TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const AdminPanel = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false); 
    const [mode, setMode] = useState('current'); 
    const [date, setDate] = useState(new Date()); 
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); 
    const [endDate, setEndDate] = useState(new Date()); 
    const [showPicker, setShowPicker] = useState(false);
    const [pickerType, setPickerType] = useState('date'); 

    const loadDepartments = useCallback(async () => {
        setLoading(true);
        try {
            await createTables(); 
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDepartments(); }, [loadDepartments]);

    const handleAddDepartment = useCallback(async (name) => {
        try {
            await createTables(); 
            await addDepartment(name);
            await loadDepartments();
        } catch (error) { throw error; }
    }, [loadDepartments]);

    const handleDeleteDepartment = useCallback((name) => {
        Alert.alert('Verwijderen', name, [
            { text: 'Annuleren', style: 'cancel' },
            { text: 'Verwijderen', style: 'destructive', onPress: async () => {
                await createTables(); 
                await deleteDepartment(name);
                await loadDepartments();
            }}
        ]);
    }, [loadDepartments]);

    const onDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            if (pickerType === 'date') setDate(selectedDate);
            if (pickerType === 'start') setStartDate(selectedDate);
            if (pickerType === 'end') setEndDate(selectedDate);
        }
    };

    const formatDate = (rawDate) => rawDate.toLocaleDateString('nl-NL');

    // Deze functie geeft nu alleen de View terug, zonder dat het de hoofd-return blokkeert
    const renderHeader = () => (
        <View>
            <View style={{ flexDirection: 'row', padding: 20, gap: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button_layout, { flex: 1, paddingVertical: 15 }]}><Text style={styles.button_text}>Terug naar Home</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowAddModal(true)} style={[styles.button_layout, { flex: 1, paddingVertical: 15 }]}><Text style={styles.button_text}>+ Nieuwe Afdeling</Text></TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                <TouchableOpacity 
                    onPress={() => setMode('current')} 
                    style={{ padding: 10, backgroundColor: mode === 'current' ? color.GREEN_600 : '#ddd', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
                >
                    <Text style={{ color: mode === 'current' ? 'white' : 'black', fontWeight: 'bold' }}>Huidig</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setMode('single')} 
                    style={{ padding: 10, backgroundColor: mode === 'single' ? color.GREEN_600 : '#ddd' }}
                >
                    <Text style={{ color: mode === 'single' ? 'white' : 'black', fontWeight: 'bold' }}>Dag</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setMode('range')} 
                    style={{ padding: 10, backgroundColor: mode === 'range' ? color.GREEN_600 : '#ddd', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
                >
                    <Text style={{ color: mode === 'range' ? 'white' : 'black', fontWeight: 'bold' }}>Periode</Text>
                </TouchableOpacity>
            </View>

            {(mode === 'single' || mode === 'range') && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
                    {mode === 'single' ? (
                        <TouchableOpacity onPress={() => { setPickerType('date'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderRadius: 8 }}><Text>📅 {formatDate(date)}</Text></TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => { setPickerType('start'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderRadius: 8 }}><Text>Van: {formatDate(startDate)}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setPickerType('end'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderRadius: 8 }}><Text>Tot: {formatDate(endDate)}</Text></TouchableOpacity>
                        </>
                    )}
                </View>
            )}

            <BarChart
                data={{ 
                    labels: departments.length > 0 ? departments.map(d => d.name) : ["Geen data"], 
                    datasets: [{ data: departments.length > 0 ? departments.map(d => d.count) : [0] }] 
                }}
                width={screenWidth - 40} height={220}
                chartConfig={{ backgroundColor: color.GREEN_200, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }}
                style={{ marginVertical: 20, alignSelf: 'center', borderRadius: 16 }}
            />
        </View>
    );

    // Dit is de enige echte return van de AdminPanel component
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color.GRAY_900 }}>
            <FlatList
                data={departments}
                keyExtractor={(item) => item.name}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <View style={[styles.department_section, { flexDirection: 'row', justifyContent: 'space-between', padding: 15 }]}>
                        <Text style={styles.department}>{item.name}: {item.count}</Text>
                        <TouchableOpacity onPress={() => handleDeleteDepartment(item.name)} style={{ backgroundColor: color.Red_900, padding: 5, borderRadius: 5 }}><Text style={{ color: 'white' }}>Verwijder</Text></TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={<TouchableOpacity onPress={loadDepartments} style={[styles.button_layout, { margin: 20 }]}><Text style={styles.button_text}>Ververs Data</Text></TouchableOpacity>}
            />
            
            {showPicker && (
                <DateTimePicker
                    value={pickerType === 'date' ? date : (pickerType === 'start' ? startDate : endDate)}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <AddDepartmentModal visible={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddDepartment} />
        </SafeAreaView>
    );
};

export default AdminPanel;