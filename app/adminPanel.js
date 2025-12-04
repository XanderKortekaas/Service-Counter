import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import color from "./_color";
import { getAllDepartments } from './_database';
import styles from "./_styleSheet";

const screenWidth = Dimensions.get("window").width; 

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

    const handleShareData = async () => {
        if (departments.length === 0) {
            Alert.alert("Geen Data", "Er is geen afdelingsdata om te delen.");
            return;
        }

        const departmentListText = departments
            .map(d => `${d.name}: ${d.count}`)
            .join('\n');

        const totalCount = departments.reduce((sum, d) => sum + d.count, 0);

        const shareMessage = 
    `Afdelingen Overzicht Rapport:

    ---

    Aantal Afdelingen: ${departments.length}
    Totaal Aantal Items/Personen: ${totalCount}

    ---

    Gedetailleerde Lijst:
    ${departmentListText}

    ---

    Dit rapport is gegenereerd vanuit de mobiele app.`;

        try {
            await Share.share({
                message: shareMessage,
                title: 'Rapport Afdelingen Overzicht',
            }, {
                dialogTitle: 'Deel Afdelingen Data via...',
            });

        } catch (error) {
            console.error("Fout bij delen: ", error);
            Alert.alert("Fout", "Kon het deelscherm niet openen.");
        }
    };

    const renderChart = () => {
        const chartData = {
            labels: departments.map(d => d.name),
            datasets: [
                {
                    data: departments.map(d => d.count),
                },
            ],
        };

        const chartConfig = {
            backgroundColor: color.GREEN_200,
            backgroundGradientFrom: color.GREEN_200,
            backgroundGradientTo: color.GREEN_600,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForLabels: {
                fontSize: 10,
            }
        };

        if (departments.length === 0) return null;

        return (
            <View style={{ marginVertical: 20, alignItems: 'center' }}>
                <Text style={[styles.app_text, {marginBottom: 10, fontWeight: 'bold'}]}>
                    Afdelingen Data Grafiek
                </Text>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        );
    };
    
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
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={[styles.button_layout, { margin: 20 }]}
            >
                <Text style={styles.button_text}>
            ← Terug naar Home</Text>
            </TouchableOpacity>

            <Text style={[styles.app_header, 
        { marginBottom: 20 }]}>
                Afdelingen Overzicht
            </Text>
            
            {renderChart()}
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginHorizontal: 20 }} />

            <TouchableOpacity 
                onPress={handleShareData} 
                style={[styles.button_layout, { marginHorizontal: 20, marginTop: 10, backgroundColor: color.BLUE_500 }]}
            >
                <Text style={styles.button_text}>
            📧 Deel Overzicht via E-mail</Text>
            </TouchableOpacity>

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