
import * as SQLite from 'expo-sqlite';

let db = null; 

if (SQLite) {
  try {
    db = SQLite.openDatabaseSync('myDatabase.db'); 
  } catch (error) {
    console.error("error while opening database:", error);
  }
} else {    
  db = {
        transaction: (callback) => { 
          console.warn("Database functions are disabled."); 
         callback({ executeSql: () => {} }); 
      }
  };
}


export const createTables = () => {
  if (db) {

      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS departments (name TEXT PRIMARY KEY NOT NULL, count INTEGER);'
        );
    });
  }
};

export const getDepartment = (name, callback) => {
    if (db) {
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
    } else {
        callback(0);
    }
};

export const updateDepartment = (name, newCount) => {
    if (db) {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT OR REPLACE INTO departments (name, count) VALUES (?, ?);',
                [name, newCount]
            );
        });
    }
};