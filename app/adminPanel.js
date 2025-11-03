import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Flatlist, SafeAreaViewBase, Text, TouchableOpacity, View } from "react-native";
import color from "./color";
import { createTables, getAllDepartments, updateDepartment } from './database';
import styles from "./styleSheet";
const initializeData = async() => {
    await createTables();
    await updateDepartment();
}

const DepartmentListScreen = ()=> {
    const[departments, setDepartments] = useState([]);
    const[loading, setLoading] = useState(true);

    // funtion to get all the data out of the database
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartmentsdata(data);
        } catch (error){
            console.error("something went wrong while loading all departments: ", error);
            // Gebruik van Alert.alert is OK, maar voor de zekerheid de melding duidelijker maken
            Alert.alert("Fout", "Kon de afdelingen niet laden vanuit de database.");
        } finally{
            setLoading(false);
        }
    }, []);
    // function to initialise and load all the data on start up 
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
                <ActivityIndicator size={"large"} color={color.GREEN_200}></ActivityIndicator>
                <Text>Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaViewBase style={styles.counter_container}>
            <Text style={styles.App_header}>Department Overview</Text>

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
                />
            )}
            <TouchableOpacity onPress={handleRefresh} style={styles.bottomButton}>
                <Text style={styles.buttonText}>Refresh Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;
