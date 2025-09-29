import React from 'react';
import { Text, View } from "react-native";

import styles from './styleSheet';

import DepartmentCounter from './DepartmentCounter';

export default function Index() {
    return (
        <View style={styles.style}>
            <View style={styles.App}>
                <View style={styles.App_header}> 
                    <Text style={styles.App_header}>Welcome to the Chistelijke Hogeschool Ede</Text>
                </View>

                <View style={styles['App-container']}>
                    
                  <DepartmentCounter departmentName="IT" />
                    
                  <DepartmentCounter departmentName="Finance" />

                  <DepartmentCounter departmentName="Internal Affairs" />

                </View>
            </View>
        </View>
    );
}



