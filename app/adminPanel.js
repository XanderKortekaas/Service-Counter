import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import {
    addDepartment,
    deleteDepartment,
    getAllDepartments,
    resetDepartmentCount,
    updateDepartmentCount
} from './_database';
import styles from "./_styleSheet";
0
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
// MAIN ADMIN PANEL COMPONENT
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

    const handleIncrementCount = useCallback(async (name, currentCount) => {
        try {
            await updateDepartmentCount(name, currentCount + 1);
            await loadDepartments();
        } catch (error) {
            Alert.alert('Fout', 'Kon teller niet verhogen');
        }
    }, [loadDepartments]);

    const handleDecrementCount = useCallback(async (name, currentCount) => {
        if (currentCount > 0) {
            try {
                await updateDepartmentCount(name, currentCount - 1);
                await loadDepartments();
            } catch (error) {
                Alert.alert('Fout', 'Kon teller niet verlagen');
            }
        }
    }, [loadDepartments]);

    const handleResetCount = useCallback((name) => {
        Alert.alert(
            'Reset Teller',
            `Wil je de teller voor "${name}" resetten naar 0?`,
            [
                { text: 'Annuleren', style: 'cancel' },
                {
                    text: 'Reset',
                    onPress: async () => {
                        try {
                            await resetDepartmentCount(name);
                            await loadDepartments();
                        } catch (error) {
                            Alert.alert('Fout', 'Kon teller niet resetten');
                        }
                    }
                }
            ]
        );
    }, [loadDepartments]);
    
    const renderItem = ({item}) => (
        <View style={styles.department_section}>
            {/* Department info */}
            <View style={{ flex: 1 }}>
                <Text style={styles.department}>{item.name}</Text>
                <Text style={[styles.department_count, { fontSize: 28 }]}>
                    Teller: {item.count}
                </Text>
            </View>

            {/* Controls */}
            <View style={{ gap: 10 }}>
                {/* Count buttons */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.button_layout, { borderColor: color.OLIVE_500, minWidth: 50 }]}
                        onPress={() => handleDecrementCount(item.name, item.count)}
                    >
                        <Text style={styles.button_text}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button_layout, { borderColor: color.VIOLET_500, minWidth: 50 }]}
                        onPress={() => handleIncrementCount(item.name, item.count)}
                    >
                        <Text style={styles.button_text}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.button_layout, { borderColor: color.BLUE_700, flex: 0.5 }]}
                        onPress={() => handleResetCount(item.name)}
                    >
                        <Text style={[styles.button_text, { fontSize: 14 }]}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button_layout, { borderColor: '#ff4444', flex: 0.5}]}
                        onPress={() => handleDeleteDepartment(item.name)}
                    >
                        <Text style={[styles.button_text, { fontSize: 14 }]}>Verwijder</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    
    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size={"large"} color={color.GREEN_200} />
                <Text style={styles.app_text}>Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={[styles.style, { flex: 1 }]}>
            {/* Header */}
            <View style={{ padding: 20, gap: 15 }}>
                <Text style={[styles.app_header, { textAlign: 'center' }]}>
                    Afdelingen Beheer
                </Text>
                <View style= {styles.button_group}>
                    <TouchableOpacity 
                    onPress={() => setShowAddModal(true)}
                    style={[styles.button_layout, { borderColor: color.BLUE_700 }]}
                >
                    <Text style={styles.button_text}>+ Nieuwe Afdeling</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={[styles.button_layout, {borderColor: color.GREEN_500}]}
                >
                    <Text style={styles.button_text}>← Terug naar Home</Text>
                </TouchableOpacity>
                </View>
            </View>
            
            {departments.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.app_text}>
                        Geen afdelingen gevonden
                    </Text>
                    <Text style={[styles.app_text, { fontSize: 16, marginTop: 10 }]}>
                        Klik op "Nieuwe Afdeling" om te beginnen
                    </Text>
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ padding: 20 }}
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    onRefresh={loadDepartments}
                    refreshing={loading} 
                />
            )}

            {/* Add Department Modal */}
            <AddDepartmentModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddDepartment}
            />
        </SafeAreaView>
    );
};

export default DepartmentListScreen;