import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import Colors from './_color';
// syncAndCleanup en getAllDepartments zijn cruciaal voor het dynamisch laden
import { createTables, getAllDepartments, syncAndCleanup } from './_database';
import styles from './_styleSheet';

// Interface die de structuur van de data uit getAllDepartments weerspiegelt
interface Department {
    name: string; 
    count: number;
}

export default function Index() {
    const [dbReady, setDbReady] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]); 
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Functie om de totale telling te berekenen uit de geladen afdelingen
    const calculateTotalCount = (data: Department[]) => {
        return data.reduce((sum, dept) => sum + dept.count, 0);
    }
    
    // Functie om de afdelingen uit de DB te laden en de state bij te werken
    const loadDepartments = useCallback(async () => {
        try {
            const data = await getAllDepartments();
            setDepartments(data as Department[]); 
            // Bereken en update de totale telling
            setTotalCount(calculateTotalCount(data));
        } catch (error) {
            console.error('Error loading departments:', error);
            setDepartments([]); // Zorg voor een lege lijst bij fout
        }
    }, []);

    // Deze callback wordt door DepartmentCounter aangeroepen na een wijziging
    const handleCounterUpdate = useCallback(async () => {
        // Herlaad de afdelingen en telling na elke stem
        await loadDepartments();
    }, [loadDepartments]);

    useEffect(() => {
        const initDB = async () => {
            try {
                // 1. Tabellen initialiseren
                await createTables();
                // 2. Synchroniseren met Supabase
                await syncAndCleanup(); 
                // 3. Afdelingen laden
                await loadDepartments();
                setDbReady(true);
            } catch (error) {
                console.error('Database initialization error:', error);
            }
        };
        initDB();
    }, [loadDepartments]);


    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await syncAndCleanup(); // Eerst syncen
        await loadDepartments(); // Daarna laden
        setRefreshing(false);
    }, [loadDepartments]);

    if (!dbReady) {
        return (
            <View style={[styles.style, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.GREEN_200} />
                <Text style={styles.app_text}>Database wordt geladen...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.style, { flex: 1 }]}>
            <ScrollView
                style={[ styles.scrollview_style]}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.GREEN_200}
                    />
                }
            >
                {/* Header en Admin Panel knop */}
                <View style={styles.app}>
                    <Text style={styles.app_header_text}>
                        Welkom bij de Christelijke Hogeschool Ede
                    </Text>

                    {/* Totaal Statistiek */}
                    <View style={styles.customer_stats_layout}>
                        <Text style={[styles.department, { textAlign: 'center', marginBottom: 5 }]}>
                            Totaal Aantal Bezoekers
                        </Text>
                        <Text style={[styles.customer_text, { textAlign: 'center', fontSize: 48 }]}>
                            {totalCount}
                        </Text>
                    </View>
                
                    
                    <TouchableOpacity style={[styles.modal_button, { marginTop: 20 }]}>
                        <Link href="/adminPanel" asChild>
                            <Text style={styles.customer_text}>Admin Panel</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
            
                {/* Departments */}
                <View style={styles.counter_container}>
                    <Text style={[styles.counter_section_h1, { marginBottom: 20, textAlign: 'center' }]}>
                        Afdelingen
                    </Text>

                    {departments.length === 0 ? (
                        <View style={styles.center}>
                            <Text style={styles.app_text}>
                                Geen afdelingen gevonden
                            </Text>
                            <Text style={[styles.app_text, { fontSize: 16, marginTop: 10 }]}>
                                Ga naar het Admin Panel om afdelingen toe te voegen
                            </Text>
                        </View>
                    ) : (
                        // 🚀 Render dynamisch de DepartmentCounters
                        departments.map((dept) => (
                            <DepartmentCounter 
                                key={dept.name} 
                                departmentName={dept.name} 
                                initialCount={dept.count} 
                                onUpdate={handleCounterUpdate}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}