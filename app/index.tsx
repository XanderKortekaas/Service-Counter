import React from 'react';
import { ScrollView } from 'react-native';
import DepartmentCounter from './DepartmentCounter';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <DepartmentCounter departmentName="IT" />
      <DepartmentCounter departmentName="Finance" />
      <DepartmentCounter departmentName="Internal Affairs" />
    </ScrollView>
  );
}