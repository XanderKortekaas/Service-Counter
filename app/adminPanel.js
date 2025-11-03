import { useCallback, useEffect, useState } from "react";
// FIX: Imports opgeschoond en 'SafeAreaView' toegevoegd
import { ActivityIndicator, Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
// FIX: Imports naar underscore-versies
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

// Deze functie is niet meer nodig, want createTables wordt in _layout.tsx gerund.
// De logica van updateDepartment is hier ook niet van toepassing.
// const initializeData = async() => {
//     await createTables();
//     await updateDepartment();
// }

const DepartmentListScreen = ()=> {
    const[departments, setDepartments] = useState([]);
    const[loading, setLoading] = useState(true);

    // Functie om alle data uit de database op te halen
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            // FIX: Typo opgelost: setDepartmentsdata is nu setDepartments
            setDepartments(data); 
        } catch (error){
            console.error("something went wrong while loading all departments: ", error);
            // Gebruik van Alert.alert is OK, maar voor de zekerheid de melding duidelijker maken
            Alert.alert("Fout", "Kon de afdelingen niet laden vanuit de database.");
        } finally{
            setLoading(false);
        }
    }, []);
    
    // Functie om alle data te laden bij opstart
    useEffect(() => {
        // Omdat initializeData (met createTables) nu in _layout.tsx staat, 
        // hoeven we alleen nog loadDepartments te roepen.
        loadDepartments();
    }, [loadDepartments]); // loadDepartments is een afhankelijkheid, maar useCallback maakt dit veilig

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
                {/* LET OP: Zorg dat color.GREEN_200 bestaat in je _color.js bestand */}
                <ActivityIndicator size={"large"} color={color.GREEN_200}></ActivityIndicator>
                <Text>Database is aan het laden...</Text>
            </View>
        );
    }
    
    return(
        // FIX: SafeAreaViewBase vervangen door de correcte import SafeAreaView
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
                // Trek de lijst naar beneden om te verversen
                onRefresh={handleRefresh}
                refreshing={loading} 
                />
            )}
            
            {/* Deze knop is redundant als FlatList onRefresh heeft, maar ik laat 'm staan */}
            <TouchableOpacity onPress={handleRefresh} style={styles.bottomButton}>
                <Text style={styles.buttonText}>Ververs Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;
