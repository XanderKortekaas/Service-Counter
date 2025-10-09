import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import styles from './styleSheet';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
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
    </ScrollView>
  );
}