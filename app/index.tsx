import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DepartmentCounter from './DepartmentCounter';
import styles from './_styleSheet';

export default function Index() {
  return (
    <View style={[styles.style, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Vroeger: styles.app_header. Nu: styles.app_header_container */}
        <View style={styles.app_header_container}>
          {/* Vroeger: styles.app_header. Nu: styles.app_header_text */}
          <Text style={styles.app_header_text}>
            Welcome to the Chistelijke Hogeschool Ede
          </Text>
          
          <Link href="/adminPanel" asChild>
            <TouchableOpacity style={styles.modal_button}>
              <Text style={styles.button_text}>Admin Panel</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.counter_container}>
          <DepartmentCounter departmentName="IT" />
          <DepartmentCounter departmentName="Finance" />
          <DepartmentCounter departmentName="Internal Affairs" />
        </View>
      </ScrollView>
    </View>
  );
}
