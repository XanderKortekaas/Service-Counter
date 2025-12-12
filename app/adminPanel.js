import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    KeyboardAvoidingView, // Voor modal
    Modal, // Voor modal
    Platform,
    Share,
    Text,
    TextInput, // Voor modal
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import {
    addDepartment, // Nodig voor beheer
    deleteDepartment, // Nodig voor beheer
    getAllDepartments // Aangepast om optioneel met datums te werken
} from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width;

// ============================================
// ADD DEPARTMENT MODAL COMPONENT
// ============================================
const AddDepartmentModal = ({ visible, onClose, onAdd }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!departmentName.trim()) {
            Alert.alert('Fout', 'Vul een afdeling naam in');
            return;
        }

        setLoading(true);
        try {
            await onAdd(departmentName.trim());
            setDepartmentName('');
            onClose();
        } catch (error) {
            // Foutmelding kan vanuit database komen dat de naam al bestaat
            Alert.alert('Fout', 'Kon afdeling niet toevoegen. Deze naam bestaat mogelijk al.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Nieuwe Afdeling</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Afdeling naam..."
                        placeholderTextColor={color.GRAY_200}
                        value={departmentName}
                        onChangeText={setDepartmentName}
                        autoFocus
                    />

                    <View style={styles.button_group}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Annuleren</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.addButton]}
                            onPress={handleAdd}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Bezig...' : 'Toevoegen'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// ============================================
// HOOFD ADMIN COMPONENT
// ============================================
const AdminPanel = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false); // Voor toevoegen modal

    // --- DATUM CONFIGURATIE (Historische Weergave) ---
    const [mode, setMode] = useState('current'); // 'current', 'single', of 'range'
    const [date, setDate] = useState(new Date()); 
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); 
    const [endDate, setEndDate] = useState(new Date()); 

    // Picker instellingen
    const [showPicker, setShowPicker] = useState(false);
    const [pickerType, setPickerType] = useState('date'); // 'date', 'start' of 'end'

    const loadDepartments = useCallback(async () => {
        setLoading(true);
        try {
            let queryStart = null;
            let queryEnd = null;

            // Bepaal de tijdsperiode
            if (mode === 'single') {
                queryStart = new Date(date);
                queryStart.setHours(0, 0, 0, 0);
                
                queryEnd = new Date(date);
                queryEnd.setHours(23, 59, 59, 999);
            } else if (mode === 'range') {
                queryStart = new Date(startDate);
                queryStart.setHours(0, 0, 0, 0);

                queryEnd = new Date(endDate);
                queryEnd.setHours(23, 59, 59, 999);
            }
            
            // Haal data op. Als mode 'current' is, worden queryStart/queryEnd null gelaten
            // en haalt getAllDepartments de huidige stand op (zoals gedefinieerd in _database.js)
            const data = await getAllDepartments(queryStart, queryEnd);
            setDepartments(data);
            
        } catch (error) {
            console.error("Fout bij laden admin panel data:", error);
            Alert.alert("Fout", "Kon de afdelingsdata niet laden.");
        } finally {
            setLoading(false);
        }
    }, [mode, date, startDate, endDate]);

    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    const handleRefresh = () => {
        loadDepartments();
    }

    // --- BEHEER FUNCTIES ---
    const handleAddDepartment = useCallback(async (name) => {
        try {
            await addDepartment(name);
            await loadDepartments(); // Herlaad na toevoegen
            Alert.alert('Succes', `Afdeling "${name}" toegevoegd!`);
        } catch (error) {
            console.error("Fout bij toevoegen afdeling:", error);
            throw error;
        }
    }, [loadDepartments]);

    const handleDeleteDepartment = useCallback((name) => {
        Alert.alert(
            'Verwijderen',
            `Weet je zeker dat je "${name}" wilt verwijderen? Dit verwijdert ook de teller in Supabase.`,
            [
                { text: 'Annuleren', style: 'cancel' },
                {
                    text: 'Verwijderen',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDepartment(name);
                            await loadDepartments(); // Herlaad na verwijderen
                            Alert.alert('Succes', 'Afdeling verwijderd');
                        } catch (error) {
                            Alert.alert('Fout', 'Kon afdeling niet verwijderen');
                        }
                    }
                }
            ]
        );
    }, [loadDepartments]);
    // ----------------------

    // Datum selectie handler
    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowPicker(false); 
        
        if (selectedDate) {
            if (pickerType === 'date') setDate(selectedDate);
            if (pickerType === 'start') setStartDate(selectedDate);
            if (pickerType === 'end') setEndDate(selectedDate);
        }
    };

    const formatDate = (rawDate) => {
        return rawDate.toLocaleDateString('nl-NL');
    }

    const renderItem = ({ item }) => (
        // Toon de huidige stand (met verwijderknop) of historische telling
        <View style={[styles.department_section, { justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.department}>{[item.name, ':']}</Text>
                <Text style={styles.department_count}>{item.count}</Text>
            </View>
            {(mode === 'current' || mode === 'single' && new Date(item.last_updated).getDate() === new Date().getDate()) && (
                <TouchableOpacity // Alleen verwijderen toestaan in "Huidige Stand" modus of vandaag
                    onPress={() => handleDeleteDepartment(item.name)}
                    style={[styles.button_layout, { backgroundColor: '#ff4444', width: 100 }]}
                >
                    <Text style={[styles.button_text, { color: 'white' }]}>
                        Verwijder
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const handleShareData = async () => {
        if (departments.length === 0) {
            Alert.alert("Geen Data", "Er is niks om te delen.");
            return;
        }

        const listText = departments.map(d => `${d.name}: ${d.count}`).join('\n');
        const total = departments.reduce((sum, d) => sum + d.count, 0);
        
        let periodeLabel = 'Huidige Stand';
        if (mode === 'single') {
            periodeLabel = `Rapport: ${formatDate(date)}`;
        } else if (mode === 'range') {
            periodeLabel = `Rapport: ${formatDate(startDate)} t/m ${formatDate(endDate)}`;
        }


        const shareMessage = 
    `Afdelingen Overzicht Rapport (${periodeLabel}):

    ---

    Aantal Afdelingen: ${departments.length}
    Totaal Aantal Items/Personen: ${total}

    ---

    Gedetailleerde Lijst:
    ${listText}

    ---

    Dit rapport is gegenereerd vanuit de mobiele app.`;


        try {
            await Share.share({
                message: shareMessage,
                title: 'Admin Rapport',
            }, {
                dialogTitle: 'Deel Rapport via...',
            });
        } catch (error) {
            Alert.alert("Fout", "Kon niet delen.");
        }
    };

    const renderChart = () => {
        if (departments.length === 0) return null;

        const chartData = {
            labels: departments.map(d => d.name),
            datasets: [{ data: departments.map(d => d.count) }],
        };
        
        const chartTitle = mode === 'current' ? 'Huidige Afdelingen Stand' : 'Historisch Overzicht';


        return (
            <View style={{ marginVertical: 20, alignItems: 'center' }}>
                <Text style={[styles.app_text, { marginBottom: 10, fontWeight: 'bold' }]}>
                    {chartTitle}
                </Text>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: color.GREEN_200,
                        backgroundGradientFrom: color.GREEN_200,
                        backgroundGradientTo: color.GREEN_600,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForLabels: { fontSize: 10 }
                    }}
                    verticalLabelRotation={30}
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={"large"} color={color.GREEN_200} />
                <Text style={styles.app_text}>Data laden...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.style, { flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, gap: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button_layout, { flex: 1, borderColor: color.GREEN_500 }]}>
                    <Text style={styles.button_text}>← Terug naar Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setShowAddModal(true)}
                    style={[styles.button_layout, { flex: 1, borderColor: color.BLUE_700 }]}
                >
                    <Text style={styles.button_text}>+ Nieuwe Afdeling</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.app_header, { marginBottom: 10 }]}>Afdelingen Beheer</Text>

            {/* --- FILTER KNOPPEN --- */}
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                {/* Switcher */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => setMode('current')} style={{ padding: 10, backgroundColor: mode === 'current' ? color.GREEN_600 : '#ddd', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                        <Text style={{ color: mode === 'current' ? 'white' : 'black' }}>Huidige Stand</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode('single')} style={{ padding: 10, backgroundColor: mode === 'single' ? color.GREEN_600 : '#ddd' }}>
                        <Text style={{ color: mode === 'single' ? 'white' : 'black' }}>Dag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode('range')} style={{ padding: 10, backgroundColor: mode === 'range' ? color.GREEN_600 : '#ddd', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: mode === 'range' ? 'white' : 'black' }}>Periode</Text>
                    </TouchableOpacity>
                </View>

                {/* Datum Velden - alleen zichtbaar in historische modus */}
                {(mode === 'single' || mode === 'range') && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                        {mode === 'single' ? (
                            <TouchableOpacity onPress={() => { setPickerType('date'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                                <Text>📅 Datum: {formatDate(date)}</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => { setPickerType('start'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                                    <Text>Van: {formatDate(startDate)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setPickerType('end'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                                    <Text>Tot: {formatDate(endDate)}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

                {showPicker && (
                    <DateTimePicker
                        value={pickerType === 'date' ? date : (pickerType === 'start' ? startDate : endDate)}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>

            {renderChart()}
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginHorizontal: 20 }} />

            <TouchableOpacity onPress={handleShareData} style={[styles.button_layout, { marginHorizontal: 20, marginTop: 10, backgroundColor: color.BLUE_500 }]}>
                <Text style={styles.button_text}>📧 Deel Rapport</Text>
            </TouchableOpacity>

            {/* Lijst van afdelingen */}
            <FlatList
                data={departments}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                onRefresh={handleRefresh}
                refreshing={loading}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Geen data gevonden voor deze selectie.</Text>}
            />
            
            <TouchableOpacity onPress={handleRefresh} style={[styles.button_layout, { margin: 20 }]}>
                <Text style={styles.button_text}>Ververs Data</Text>
            </TouchableOpacity>


            {/* Add Department Modal Component */}
            <AddDepartmentModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddDepartment}
            />
        </SafeAreaView>
    );
};

export default AdminPanel;