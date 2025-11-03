import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

const DepartmentListScreen = ()=> {
    const[departments, setDepartments] = useState([]);
    const[loading, setLoading] = useState(true);

    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartmentsdata(data);
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
                <ActivityIndicator size={"large"} color={color.GREEN_200}></ActivityIndicator>
                <Text>Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={styles.counter_container}>
            <Text style={styles.App_header}>Afdelingen Overzicht (Admin)</Text>

            {departments.length ===0 ?(<View style = {styles.center}>
                <Text style={styles.empty_Text}>No departments Found</Text>
                <TouchableOpacity onPress={handleRefresh} style = {styles.button}>
                    <Text style = {styles.button_text}>Refresh</Text>
                </TouchableOpacity>
            </View>):(
                <Flatlist
                data = {departments}
                renderItem = {renderItem}
                keyExtractor = {(item) => item.name}
                onRefresh={handleRefresh}
                refreshing={loading} 
                />
            )}
            
            <TouchableOpacity onPress={handleRefresh} style={styles.bottomButton}>
                <Text style={styles.buttonText}>Refresh Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;
