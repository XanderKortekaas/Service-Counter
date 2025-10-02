import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { createTables, getDepartment, updateDepartment } from './database';

function DepartmentCounter({ departmentName }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    createTables();
    getDepartment(departmentName, setCount);
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    updateDepartment(departmentName, newCount);
  };

  const handleDecrement = () => {
    const newCount = Math.max(0, count - 1);
    setCount(newCount);
    updateDepartment(departmentName, newCount);
  };

  return (
    <View style={{ margin: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>{departmentName}</Text>
      <Text style={{ fontSize: 32 }}>{count}</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button title="-" onPress={handleDecrement} />
        <View style={{ width: 20 }} />
        <Button title="+" onPress={handleIncrement} />
      </View>
    </View>
  );
}

export default DepartmentCounter;