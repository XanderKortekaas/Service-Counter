import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
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
        <View style={styles.item_container}>
            <Text style={styles.department_name}>{item.name}</Text>
            <Text style={styles.department_count}>{item.count}</Text>
        </View>
    );
    
    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size={"large"} color={color.GREEN_200}></ActivityIndicator>
                <Text>Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={styles.counter_container}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.button}
            >
                <Text style={styles.button_text}>← Back to Home</Text>
            </TouchableOpacity>
            
            <Text style={styles.App_header}>Department Overview</Text>
            
            {departments.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.empty_Text}>No departments Found</Text>
                    <TouchableOpacity onPress={handleRefresh} style={styles.button}>
                        <Text style={styles.button_text}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                />
            )}
            
            <TouchableOpacity onPress={handleRefresh} style={styles.bottomButton}>
                <Text style={styles.buttonText}>Refresh Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;