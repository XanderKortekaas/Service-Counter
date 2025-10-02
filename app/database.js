import { Platform } from 'react-native';

let SQLite;
if (Platform.OS !== 'web') {
  SQLite = require('expo-sqlite');
} else {
  SQLite = { openDatabase: () => { throw new Error('expo-sqlite does not work on web!'); } };
}
const db = SQLite.openDatabase('myDatabase.db');

export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS departments (name TEXT PRIMARY KEY NOT NULL, count INTEGER);'
    );
  });
};

export const getDepartment = (name, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT count FROM departments WHERE name = ?;',
      [name],
      (_, { rows }) => {
        if (rows.length > 0) {
          callback(rows.item(0).count);
        } else {
          callback(0);
        }
      }
    );
  });
};

export const updateDepartment = (name, newCount) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT OR REPLACE INTO departments (name, count) VALUES (?, ?);',
      [name, newCount]
    );
  });
};