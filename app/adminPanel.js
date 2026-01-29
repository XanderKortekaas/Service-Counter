import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert, Dimensions, FlatList,
    Modal,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { addDepartment, createTables, deleteDepartment, getAllDepartments, renameDepartment } from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width;

const AdminPanel = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showAddModal, setShowAddModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [selectedDept, setSelectedDept] = useState({ oldName: '', newName: '' });
    
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

    const handleAddDepartment = async () => {
        if (!newDeptName.trim()) return;
        try {
            await addDepartment(newDeptName.trim());
            setNewDeptName('');
            setShowAddModal(false);
            await loadDepartments();
        } catch (error) {
            Alert.alert("Fout", "Kon afdeling niet toevoegen.");
        }
    };

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

    const handleDeleteDepartment = useCallback((name) => {
        Alert.alert('Verwijderen', `Weet je zeker dat je ${name} wilt verwijderen?`, [
            { text: 'Annuleren', style: 'cancel' },
            { text: 'Verwijderen', style: 'destructive', onPress: async () => {
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

    const chartData = useMemo(() => ({
        labels: departments.length > 0 ? departments.map(d => d.name) : ["..."], 
        datasets: [{ data: departments.length > 0 ? departments.map(d => d.count) : [0] }] 
    }), [departments]);

    const chartWidth = useMemo(() => Math.max(screenWidth - 40, departments.length * 90), [departments.length]);

    const renderHeader = useMemo(() => (
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

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                <TouchableOpacity onPress={() => setMode('current')} style={{ padding: 12, backgroundColor: mode === 'current' ? color.VIOLET_500 : color.GRAY_600, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Huidig</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('single')} style={{ padding: 12, backgroundColor: mode === 'single' ? color.VIOLET_500 : color.GRAY_600 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Dag</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('range')} style={{ padding: 12, backgroundColor: mode === 'range' ? color.VIOLET_500 : color.GRAY_600, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Periode</Text>
                </TouchableOpacity>
            </View>

            {(mode === 'single' || mode === 'range') && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 15 }}>
                    <TouchableOpacity onPress={() => { setPickerType(mode === 'single' ? 'date' : 'start'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: color.GRAY_700, borderRadius: 8, borderWidth: 1, borderColor: color.BLUE_700 }}>
                        <Text style={{ color: color.BLUE_700 }}>{mode === 'single' ? `📅 ${formatDate(date)}` : `Van: ${formatDate(startDate)}`}</Text>
                    </TouchableOpacity>
                    {mode === 'range' && (
                        <TouchableOpacity onPress={() => { setPickerType('end'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: color.GRAY_700, borderRadius: 8, borderWidth: 1, borderColor: color.BLUE_700 }}>
                            <Text style={{ color: color.BLUE_700 }}>Tot: {formatDate(endDate)}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
                <BarChart
                    data={chartData}
                    width={chartWidth} 
                    height={260}
                    chartConfig={{ 
                        backgroundColor: color.GRAY_800,
                        backgroundGradientFrom: color.GRAY_700,
                        backgroundGradientTo: color.GRAY_800,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(97, 218, 251, ${opacity})`, 
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForVerticalLabels: { fontSize: 10 },
                    }}
                    verticalLabelRotation={30} 
                    style={{ marginVertical: 20, borderRadius: 16 }}
                />
            </ScrollView>
        </View>
    ), [mode, date, startDate, endDate, chartData, chartWidth, navigation, loadDepartments]);

    const renderItem = useCallback(({ item }) => (
        <View style={styles.container}> 
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.counterContainer}>
                <Text style={styles.countText}>{item.count}</Text>
            </View>
            
            {mode === 'current' && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                    <TouchableOpacity 
                        onPress={() => {
                            setSelectedDept({ oldName: item.name, newName: item.name });
                            setShowEditModal(true);
                        }}
                        style={[styles.counterButton, { backgroundColor: color.BLUE_700, flex: 1, minWidth: 0 }]}
                    >
                        <Text style={styles.buttonText}>Bewerken</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDeleteDepartment(item.name)}
                        style={[styles.counterButton, styles.buttonRed, { flex: 1, minWidth: 0 }]}
                    >
                        <Text style={styles.buttonText}>Verwijderen</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    ), [mode, handleDeleteDepartment]);

    return (
        <SafeAreaView style={styles.style}>
            <FlatList
                data={departments}
                keyExtractor={(item) => item.name}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={renderItem}
                ListFooterComponent={<View style={{ height: 40 }} />}
            />

            <Modal visible={showAddModal} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Nieuwe Afdeling</Text>
                        <TextInput 
                            style={styles.input} 
                            value={newDeptName} 
                            onChangeText={setNewDeptName}
                            placeholder="Naam afdeling..."
                            placeholderTextColor={color.GRAY_500}
                            autoFocus
                        />
                        <View style={styles.button_group}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddModal(false)}>
                                <Text style={styles.buttonText}>Annuleren</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddDepartment}>
                                <Text style={styles.buttonText}>Toevoegen</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
            
            {showPicker && (
                <DateTimePicker
                    value={pickerType === 'date' ? date : (pickerType === 'start' ? startDate : endDate)}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </SafeAreaView>
    );
};

export default AdminPanel;