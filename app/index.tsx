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
import { createTables, getAllDepartments, syncAndCleanup } from './_database';
import styles from './_styleSheet';

interface Department {
    name: string; 
    count: number;
}

export default function Index() {
    const [dbReady, setDbReady] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]); 
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const calculateTotalCount = (data: Department[]) => {
        return data.reduce((sum, dept) => sum + dept.count, 0);
    }
    
    const loadDepartments = useCallback(async () => {
        try {
            const data = await getAllDepartments();
            setDepartments(data as Department[]); 
            setTotalCount(calculateTotalCount(data));
        } catch (error) {
            console.error('Error loading departments:', error);
            setDepartments([]); 
        }
    }, []);

    const handleCounterUpdate = useCallback(async () => {
        await loadDepartments();
    }, [loadDepartments]);

   useEffect(() => {
        const initDB = async () => {
            try {
                await createTables();
                await syncAndCleanup(); 
                await loadDepartments();
                setDbReady(true);
            } catch (error) {
                console.error('Fout bij initialisatie:', error);
            }
        };
        initDB();
    }, [loadDepartments]);


    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await syncAndCleanup(); 
        await loadDepartments(); 
        setRefreshing(false);
    }, [loadDepartments]);

    if (!dbReady) {
        return (
            <View style={[styles.style, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.VIOLET_500} />
                <Text style={styles.app_text}>Database wordt geladen...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.style, { flex: 1 }]}>
            <ScrollView
                style={styles.scrollview_style}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.VIOLET_500}
                    />
                }
            >
                <View style={styles.center}>
                    <Text style={styles.app_header_text}>
                        Welkom bij de Christelijke Hogeschool Ede
                    </Text>

                    <View style={styles.customer_stats_layout}>
                        <Text style={styles.title}>
                            Totaal Aantal Bezoekers
                        </Text>
                        <Text style={styles.customer_text}>
                            {totalCount}
                        </Text>
                    </View>
                
                    <TouchableOpacity style = {[styles.modal_button, { marginTop: 20, marginBottom: 20 }]}>
                        <Link href="/adminPanel" asChild>
                            <Text style={styles.modalButtonText}>Admin Panel</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
            
                <View style={styles.container}>
                    <Text style={[styles.countText, { marginBottom: 20, textAlign: 'center' }]}>
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