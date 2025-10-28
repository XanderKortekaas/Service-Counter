import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import styles from './styleSheet';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={styles.App as ViewStyle}>
        <Text style={styles.App_header as TextStyle}>
          Welcome to the Chistelijke Hogeschool Ede
        </Text>
        
        <Link href="/adminPanel" asChild>
          <TouchableOpacity style={[styles.button_layout as ViewStyle, { marginTop: 20 }]}>
            <Text style={styles.button_text as TextStyle}>Admin Panel</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles['App-container'] as ViewStyle}>
        <DepartmentCounter departmentName="IT" />
        <DepartmentCounter departmentName="Finance" />
        <DepartmentCounter departmentName="Internal Affairs" />
      </View>
    </ScrollView>
  );
}