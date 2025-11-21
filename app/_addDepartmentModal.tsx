import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ListRenderItem,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

// Interface voor de afdelingsdata
interface Department {
    id: number;
    name: string;
    count: number;
}

const DepartmentListScreen = () => {
    const navigation = useNavigation();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    
    const loadDepartments = useCallback(async() => {
        setLoading(true);
        try {
            const data = await getAllDepartments();
            setDepartments(data as Department[]); 
        } catch (error){
            console.error("Fout bij het laden van afdelingen:", error);
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
    
    const renderItem: ListRenderItem<Department> = ({ item }) => (
        <View style={styles.department_section as ViewStyle}>
            <Text style={styles.department as TextStyle}>
                {item.name}
            </Text>
            <Text style={styles.department_count as TextStyle}>
                {item.count}
            </Text>
        </View>
    );
    
    if(loading){
        return(
            <View style={styles.center as ViewStyle}>
                <ActivityIndicator size={"large"} color={color.GREEN_200} />
                <Text style={styles.app_text as TextStyle}>Database is loading...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={[styles.style as ViewStyle, { flex: 1 }]}>
            {/* Back button */}
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={[styles.button_layout as ViewStyle, { margin: 20 }]}
            >
                <Text style={styles.button_text as TextStyle}>← Terug naar Home</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={[styles.app_header_text as TextStyle, { marginBottom: 20 }]}>
                Afdelingen Overzicht
            </Text>
            
            {departments.length === 0 ? (
                <View style={styles.center as ViewStyle}>
                    <Text style={styles.app_text as TextStyle}>
                        Geen afdelingen gevonden
                    </Text>
                    
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ padding: 20 }}
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)} 
                    onRefresh={handleRefresh}
                    refreshing={loading} 
                />
            )}
            
            {/* Bottom refresh button */}
            <TouchableOpacity 
                onPress={handleRefresh} 
                style={[styles.button_layout as ViewStyle, { margin: 20 }]}
            >
                <Text style={styles.button_text as TextStyle}>Ververs Data</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DepartmentListScreen;