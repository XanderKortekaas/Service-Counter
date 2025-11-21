import * as SQLite from 'expo-sqlite';

// Open database met nieuwe API
const db = SQLite.openDatabaseSync('departments.db');

// Initialiseer tabellen
export const createTables = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS departments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                count INTEGER DEFAULT 0
            );
        `);
        console.log('✅ Database tables created successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
};

// Haal alle departments op
export const getAllDepartments = async () => {
    try {
        const result = await db.getAllAsync(
            'SELECT * FROM departments ORDER BY name ASC'
        );
        return result || [];
    } catch (error) {
        console.error('❌ Error getting departments:', error);
        throw error;
    }
};

// Voeg nieuw department toe
export const addDepartment = async (name) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO departments (name, count) VALUES (?, 0)',
            [name.trim()]
        );
        console.log(`✅ Department "${name}" added with ID: ${result.lastInsertRowId}`);
        return result;
    } catch (error) {
        console.error('❌ Error adding department:', error);
        throw error;
    }
};

// Update department naam
export const updateDepartmentName = async (oldName, newName) => {
    try {
        const result = await db.runAsync(
            'UPDATE departments SET name = ? WHERE name = ?',
            [newName.trim(), oldName]
        );
        console.log(`✅ Department renamed from "${oldName}" to "${newName}"`);
        return result;
    } catch (error) {
        console.error('❌ Error updating department name:', error);
        throw error;
    }
};

// Verwijder department
export const deleteDepartment = async (name) => {
    try {
        const result = await db.runAsync(
            'DELETE FROM departments WHERE name = ?',
            [name]
        );
        console.log(`✅ Department "${name}" deleted`);
        return result;
    } catch (error) {
        console.error('❌ Error deleting department:', error);
        throw error;
    }
};

// Update count naar specifieke waarde
export const updateDepartmentCount = async (name, newCount) => {
    try {
        const result = await db.runAsync(
            'UPDATE departments SET count = ? WHERE name = ?',
            [newCount, name]
        );
        console.log(`✅ Department "${name}" count updated to ${newCount}`);
        return result;
    } catch (error) {
        console.error('❌ Error updating count:', error);
        throw error;
    }
};

// Verhoog count met 1
export const incrementCount = async (name) => {
    try {
        const result = await db.runAsync(
            'UPDATE departments SET count = count + 1 WHERE name = ?',
            [name]
        );
        console.log(`✅ Department "${name}" count incremented`);
        return result;
    } catch (error) {
        console.error('❌ Error incrementing count:', error);
        throw error;
    }
};

// Verlaag count met 1 (niet onder 0)
export const decrementCount = async (name) => {
    try {
        const result = await db.runAsync(
            'UPDATE departments SET count = count - 1 WHERE name = ? AND count > 0',
            [name]
        );
        console.log(`✅ Department "${name}" count decremented`);
        return result;
    } catch (error) {
        console.error('❌ Error decrementing count:', error);
        throw error;
    }
};

// Reset count naar 0
export const resetDepartmentCount = async (name) => {
    return updateDepartmentCount(name, 0);
};

// Haal één specifiek department op
export const getDepartment = async (name) => {
    try {
        const result = await db.getFirstAsync(
            'SELECT * FROM departments WHERE name = ?',
            [name]
        );
        return result; 
    } catch (error) {
        console.error('❌ Error getting department:', error);
        throw error;
    }
};

// Reset ALLE counts naar 0
export const resetAllCounts = async () => {
    try {
        const result = await db.runAsync('UPDATE departments SET count = 0');
        console.log('✅ All department counts reset to 0');
        return result;
    } catch (error) {
        console.error('❌ Error resetting all counts:', error);
        throw error;
    }
};

// Verwijder ALLE departments (gebruik voorzichtig!)
export const deleteAllDepartments = async () => {
    try {
        const result = await db.runAsync('DELETE FROM departments');
        console.log('✅ All departments deleted');
        return result;
    } catch (error) {
        console.error('❌ Error deleting all departments:', error);
        throw error;
    }
};

// Initialiseer met test data (alleen als database leeg is)
export const initializeTestData = async () => {
    try {
        const existing = await getAllDepartments();
        
        if (existing.length === 0) {
            await addDepartment('IT');
            await addDepartment('Finance');
            await addDepartment('Internal Affairs');
            console.log('✅ Test data initialized');
        } else {
            console.log('ℹ️ Database already has data, skipping test data');
        }
    } catch (error) {
        console.error('❌ Error initializing test data:', error);
    }
};

export { db };

