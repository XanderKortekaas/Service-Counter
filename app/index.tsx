import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import styles from './styleSheet';

export default function Index() {
  return (
    <View style={[styles.style as ViewStyle, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.App_header as ViewStyle}>
          <Text style={styles.App_header as TextStyle}>
            Welcome to the Chistelijke Hogeschool Ede
          </Text>
            <TouchableOpacity style={[styles.modal_button as ViewStyle]}>
              <Link href="/adminPanel" asChild>
                <Text style={styles.button_text as TextStyle}>Admin Panel</Text>
              </Link>
            </TouchableOpacity>
        </View>

        <View style={styles['counter_container'] as ViewStyle}>
          <DepartmentCounter departmentName="IT" />
          <DepartmentCounter departmentName="Finance" />
          <DepartmentCounter departmentName="Internal Affairs" />
        </View>
      </ScrollView>
    </View>
  );
}
