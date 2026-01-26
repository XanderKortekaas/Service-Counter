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

interface Department {
    name: string; 
    count: number;
    last_updated?: string; 
    id?: string | number; 
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
    
    // De renderItem is aangepast naar de Card-styling met de cirkel
    const renderItem: ListRenderItem<Department> = ({ item }) => (
        <View style={styles.container as ViewStyle}> 
            <Text style={styles.title as TextStyle}>{item.name}</Text>
            
            <View style={styles.counterContainer as ViewStyle}>
                <Text style={styles.countText as TextStyle}>{item.count}</Text>
            </View>
        </View>
    );
    
    if(loading && departments.length === 0){
        return(
            <View style={[styles.style as ViewStyle, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size={"large"} color={color.VIOLET_500} />
                <Text style={[styles.app_text as TextStyle, { marginTop: 10 }]}>Laden...</Text>
            </View>
        );
    }
    
    return(
        <SafeAreaView style={[styles.style as ViewStyle, { flex: 1 }]}>
            {/* Header Knoppen met de nieuwe grijze/blauwe styling */}
            <View style={{ flexDirection: 'row', padding: 15, gap: 10 }}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={[styles.button_layout as ViewStyle, { flex: 1, paddingVertical: 12, backgroundColor: color.GRAY_700, borderColor: color.GRAY_500 }]}
                >
                    <Text style={[styles.button_text as TextStyle, { fontSize: 14 }]}>← Terug</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleRefresh} 
                    style={[styles.button_layout as ViewStyle, { flex: 1, paddingVertical: 12, backgroundColor: color.GRAY_700, borderColor: color.BLUE_700 }]}
                >
                    <Text style={[styles.button_text as TextStyle, { fontSize: 14, color: color.BLUE_700 }]}>Ververs</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.app_header_text as TextStyle, { marginBottom: 10, fontSize: 24 }]}>
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
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)} 
                    onRefresh={handleRefresh}
                    refreshing={loading} 
                />
            )}
        </SafeAreaView>
    );
};

export default DepartmentListScreen;