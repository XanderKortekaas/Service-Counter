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
import { createTables, db, getAllDepartments, initializeTestData } from './_database';
import styles from './_styleSheet';

interface Department {
    id: number;
    name: string;
    count: number;
}

interface StatsResult {
    total: number | null;
}

export default function Index() {
    const [dbReady, setDbReady] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]); 
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const loadDepartments = useCallback(async () => {
        try {
            const data = await getAllDepartments();
            setDepartments(data as Department[]); 
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    }, []);

    const loadStats = useCallback(async () => {
        try {
            const result = await db.getFirstAsync<StatsResult>(
                'SELECT SUM(count) as total FROM departments'
            );
            setTotalCount(result?.total || 0);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }, []);

    useEffect(() => {
        const initDB = async () => {
            try {
                await createTables();
                await initializeTestData();
                await loadDepartments();
                await loadStats();
                setDbReady(true);
            } catch (error) {
                console.error('Database initialization error:', error);
            }
        };
        initDB();
    }, [loadDepartments, loadStats]);

    const handleCounterUpdate = useCallback(async () => {
        await loadStats();
    }, [loadStats]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadDepartments();
        await loadStats();
        setRefreshing(false);
    }, [loadDepartments, loadStats]);

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
                contentContainerStyle={{ padding: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.GREEN_200}
                    />
                }
            >
                {/* Header */}
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
                
                    <Link href="/adminPanel" asChild>
                        <TouchableOpacity style={[styles.modal_button, { marginTop: 20 }]}>
                            <Text style={styles.customer_text}>Admin Panel</Text>
                        </TouchableOpacity>
                    </Link>
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
                        departments.map((dept) => (
                            <DepartmentCounter 
                                key={dept.id} 
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