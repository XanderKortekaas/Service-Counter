import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Share,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import {
    addDepartment,
    deleteDepartment,
    getAllDepartments
} from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width; 

// ============================================
// ADD DEPARTMENT MODAL COMPONENT (inline)
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
// MAIN DEPARTMENT LIST COMPONENT
// ============================================
const DepartmentListScreen = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false); 
    
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (error){
            console.error("something went wrong while loading all departments: ", error);
            Alert.alert("Fout", "Kon de afdelingen niet laden vanuit de database.");
        } finally{
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]); 
    
    const handleRefresh = () => {
        loadDepartments();
    }

    const handleAddDepartment = useCallback(async (name) => { 
        try {
            await addDepartment(name);
            await loadDepartments();
            Alert.alert('Succes', `Afdeling "${name}" toegevoegd!`);
        } catch (error) {
            console.error("Fout bij toevoegen afdeling:", error);
            throw error;
        }
    }, [loadDepartments]);

    const handleDeleteDepartment = useCallback((name) => { 
        Alert.alert(
            'Verwijderen',
            `Weet je zeker dat je "${name}" wilt verwijderen?`,
            [
                { text: 'Annuleren', style: 'cancel' },
                {
                    text: 'Verwijderen',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDepartment(name);
                            await loadDepartments();
                            Alert.alert('Succes', 'Afdeling verwijderd');
                        } catch (error) {
                            Alert.alert('Fout', 'Kon afdeling niet verwijderen');
                        }
                    }
                }
            ]
        );
    }, [loadDepartments]);
    
    const renderItem = ({item}) => (
        <View style={[styles.department_section, { justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.department}>
                    {[item.name,':']}
                </Text>
                <Text style={styles.department_count}>
                    {item.count}
                </Text>
            </View>
            <TouchableOpacity // <-- Verwijder knop toegevoegd
                onPress={() => handleDeleteDepartment(item.name)}
                style={[styles.button_layout, { backgroundColor: '#ff4444', width: 100 }]}
            >
                <Text style={[styles.button_text, { color: 'white' }]}>
                    Verwijder
                </Text>
            </TouchableOpacity>
        </View>
    );

    const handleShareData = async () => {
        if (departments.length === 0) {
            Alert.alert("Geen Data", "Er is geen afdelingsdata om te delen.");
            return;
        }

        const departmentListText = departments
            .map(d => `${d.name}: ${d.count}`)
            .join('\n');

        const totalCount = departments.reduce((sum, d) => sum + d.count, 0);

        const shareMessage = 
    `Afdelingen Overzicht Rapport:

    ---

    Aantal Afdelingen: ${departments.length}
    Totaal Aantal Items/Personen: ${totalCount}

    ---

    Gedetailleerde Lijst:
    ${departmentListText}

    ---

    Dit rapport is gegenereerd vanuit de mobiele app.`;

        try {
            await Share.share({
                message: shareMessage,
                title: 'Rapport Afdelingen Overzicht',
            }, {
                dialogTitle: 'Deel Afdelingen Data via...',
            });

        } catch (error) {
            console.error("Fout bij delen: ", error);
            Alert.alert("Fout", "Kon het deelscherm niet openen.");
        }
    };

    const renderChart = () => {
        const chartData = {
            labels: departments.map(d => d.name),
            datasets: [
                {
                    data: departments.map(d => d.count),
                },
            ],
        };

        const chartConfig = {
            backgroundColor: color.GREEN_200,
            backgroundGradientFrom: color.GREEN_200,
            backgroundGradientTo: color.GREEN_600,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForLabels: {
                fontSize: 10,
            }
        };

        if (departments.length === 0) return null;

        return (
            <View style={{ marginVertical: 20, alignItems: 'center' }}>
                <Text style={[styles.app_text, {marginBottom: 10, fontWeight: 'bold'}]}>
                    Afdelingen Data Grafiek
                </Text>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        );
    };
    
    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size={"large"} color={color.GREEN_200} />
                <Text style={styles.app_text}>
                Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={[styles.style, { flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, gap: 10 }}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={[styles.button_layout, { flex: 1, borderColor: color.GREEN_500 }]}
                >
                    <Text style={styles.button_text}>
                ← Terug naar Home</Text>
                </TouchableOpacity>

                <TouchableOpacity // <-- Knop voor toevoegen toegevoegd
                    onPress={() => setShowAddModal(true)}
                    style={[styles.button_layout, { flex: 1, borderColor: color.BLUE_700 }]}
                >
                    <Text style={styles.button_text}>
                + Nieuwe Afdeling</Text>
                </TouchableOpacity>
            </View>
            
            <Text style={[styles.app_header, 
        { marginBottom: 20 }]}>
                Afdelingen Overzicht
            </Text>
            
            {renderChart()}
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginHorizontal: 20 }} />

            <TouchableOpacity 
                onPress={handleShareData} 
                style={[styles.button_layout, { marginHorizontal: 20, marginTop: 10, backgroundColor: color.BLUE_500 }]}
            >
                <Text style={styles.button_text}>
            📧 Deel Overzicht via E-mail</Text>
            </TouchableOpacity>

            {departments.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.app_text}>
                        Geen afdelingen gevonden
                    </Text>
                    <TouchableOpacity 
                        onPress={handleRefresh} 
                        style={styles.button_layout}
                    >
                        <Text style={styles.button_text}>
                    Ververs</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ padding: 20 }}
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    onRefresh={handleRefresh}
                    refreshing={loading} 
                />
            )}
            
            <TouchableOpacity 
                onPress={handleRefresh} 
                style={[styles.button_layout, { margin: 20 }]}
            >
                <Text style={styles.button_text}>
            Ververs Data</Text>
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

export default DepartmentListScreen;