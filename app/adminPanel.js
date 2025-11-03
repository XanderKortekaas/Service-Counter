import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
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

    const renderItem = ({item}) => (
        <View style={styles.item_container}>
            <Text style = {styles.department_name}>{item.name}</Text>
            <Text style = {styles.department_count}>{item.count}</Text>
        </View>
    );

    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size={"large"} color={color.GREEN_200}></ActivityIndicator>
                <Text>Database is aan het laden...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={styles.counter_container}>
            <Text style={styles.App_header}>Afdelingen Overzicht (Admin)</Text>

            {departments.length === 0 ?(
                <View style = {styles.center}>
                    <Text style={styles.empty_Text}>Geen afdelingen gevonden</Text>
                    <TouchableOpacity onPress={handleRefresh} style = {styles.button}>
                        <Text style = {styles.button_text}>Ververs</Text>
                    </TouchableOpacity>
                </View>
            ):(
                <FlatList
                data = {departments}
                renderItem = {renderItem}
                keyExtractor = {(item) => item.name}
                onRefresh={handleRefresh}
                refreshing={loading} 
                />
            )}
            
            <TouchableOpacity onPress={handleRefresh} style={styles.bottomButton}>
                <Text style={styles.buttonText}>Ververs Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;
