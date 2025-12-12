import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Platform,
    Share,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width;

const AdminPanel = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- DATUM CONFIGURATIE ---
    const [mode, setMode] = useState('single'); // 'single' (1 dag) of 'range' (periode)
    const [date, setDate] = useState(new Date()); // Huidige dag
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); // Start vorige week
    const [endDate, setEndDate] = useState(new Date()); // Einde vandaag

    // Picker instellingen
    const [showPicker, setShowPicker] = useState(false);
    const [pickerType, setPickerType] = useState('date'); // 'date', 'start' of 'end'

    const loadDepartments = useCallback(async () => {
        setLoading(true);
        try {
            let queryStart, queryEnd;

            // Bepaal de tijden voor de query (00:00 tot 23:59)
            if (mode === 'single') {
                queryStart = new Date(date);
                queryStart.setHours(0, 0, 0, 0);
                
                queryEnd = new Date(date);
                queryEnd.setHours(23, 59, 59, 999);
            } else {
                queryStart = new Date(startDate);
                queryStart.setHours(0, 0, 0, 0);

                queryEnd = new Date(endDate);
                queryEnd.setHours(23, 59, 59, 999);
            }

            // Haal data op uit _database.js (die kijkt in Supabase Logs)
            const data = await getAllDepartments(queryStart, queryEnd);
            setDepartments(data);
            
        } catch (error) {
            console.error("Fout bij laden admin panel:", error);
            Alert.alert("Fout", "Kon de historie niet laden.");
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

    // Datum selectie handler
    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowPicker(false); // Android picker sluit direct
        
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
        <View style={styles.department_section}>
            <Text style={styles.department}>{[item.name, ':']}</Text>
            <Text style={styles.department_count}>{item.count}</Text>
        </View>
    );

    const handleShareData = async () => {
        if (departments.length === 0) {
            Alert.alert("Geen Data", "Er is niks om te delen.");
            return;
        }

        const listText = departments.map(d => `${d.name}: ${d.count}`).join('\n');
        const total = departments.reduce((sum, d) => sum + d.count, 0);
        const periode = mode === 'single' ? formatDate(date) : `${formatDate(startDate)} t/m ${formatDate(endDate)}`;

        try {
            await Share.share({
                message: `Admin Rapport (${periode}):\n\nTotaal: ${total}\n\nDetails:\n${listText}`,
                title: 'Admin Rapport',
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

        return (
            <View style={{ marginVertical: 20, alignItems: 'center' }}>
                <Text style={[styles.app_text, { marginBottom: 10, fontWeight: 'bold' }]}>
                    Historisch Overzicht
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
                <Text style={styles.app_text}>Historie ophalen...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.style, { flex: 1 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button_layout, { margin: 20 }]}>
                <Text style={styles.button_text}>← Terug</Text>
            </TouchableOpacity>

            <Text style={[styles.app_header, { marginBottom: 10 }]}>Admin Panel</Text>

            {/* --- FILTER KNOPPEN --- */}
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                {/* Switcher */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => setMode('single')} style={{ padding: 10, backgroundColor: mode === 'single' ? color.GREEN_600 : '#ddd', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                        <Text style={{ color: mode === 'single' ? 'white' : 'black' }}>Dag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode('range')} style={{ padding: 10, backgroundColor: mode === 'range' ? color.GREEN_600 : '#ddd', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ color: mode === 'range' ? 'white' : 'black' }}>Periode</Text>
                    </TouchableOpacity>
                </View>

                {/* Datum Velden */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                    {mode === 'single' ? (
                        <TouchableOpacity onPress={() => { setPickerType('date'); setShowPicker(true); }} style={{ padding: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                            <Text>📅 {formatDate(date)}</Text>
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

            <FlatList
                data={departments}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                onRefresh={handleRefresh}
                refreshing={loading}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Geen data gevonden voor deze selectie.</Text>}
            />
        </SafeAreaView>
    );
};

export default AdminPanel;