import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./color";
import { createTables, getAllDepartments, updateDepartment } from './database';
import styles from "./styleSheet";

const initializeData = async() => {
    await createTables();
    await updateDepartment();
}

const DepartmentListScreen = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (error){
            console.error("something went wrong while loading all departments: ", error);
            Alert.alert("Error", "could not load Departments")
        } finally{
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const initAndLoad = async () => {
            await initializeData();
            loadDepartments();
        };
        initAndLoad();
    }, [loadDepartments]);
    
    const handleRefresh = () => {
        loadDepartments();
    }
    
    const renderItem = ({item}) => (
        <View style={styles.item_section}>
            <Text style={styles.department}>
                {item.name}:   {item.count}
            </Text>
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
        <SafeAreaView style={[styles.counter_container, styles.style]}>
            <Text style={styles.app_header}>Department Overview</Text>
            
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={[styles.button, styles.button_layout]}
            >
                <Text style={styles.button_text}>Back to Home</Text>
            </TouchableOpacity>
            
            {departments.length === 0 ? (
                <View style={styles.counter_section}>
                    <Text style={styles.app_text}>No departments Found</Text>
                    <TouchableOpacity 
                        onPress={handleRefresh} 
                        style={styles.button_layout}
                    >
                        <Text style={styles.button_text}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ padding: 20 }}
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                />
            )}
            
            <TouchableOpacity 
                onPress={handleRefresh} 
                style={[styles.button_layout, { marginTop: 20, marginBottom: 60 }]}
            >
                <Text style={styles.button_text}>Refresh Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;