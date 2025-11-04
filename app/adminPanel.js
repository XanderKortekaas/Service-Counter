import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

const DepartmentListScreen = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartments(data);  // ← Fixed!
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
        <View style={styles.department_section }>
            <Text style={styles.department}>
                {[item.name,':']}
            </Text>
            <Text style={styles.department_count}>
                {item.count}
            </Text>
        </View>
    );
    
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
            {/* Back button */}
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={[styles.button_layout, { margin: 20 }]}
            >
                <Text style={styles.button_text}>
            ← Terug naar Home</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={[styles.app_header, 
        { marginBottom: 20 }]}>
                Afdelingen Overzicht
            </Text>
            
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
            
            {/* Bottom refresh button */}
            <TouchableOpacity 
                onPress={handleRefresh} 
                style={[styles.button_layout, { margin: 20 }]}
            >
                <Text style={styles.button_text}>
            Ververs Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;