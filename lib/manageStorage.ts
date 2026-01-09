import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieves an item from AsyncStorage by key
 * @param key - The storage key
 * @returns The parsed value or null if not found or on error
 */
export const getItem = async (key: string): Promise<any | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error getting item from storage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Stores an item in AsyncStorage
 * @param key - The storage key
 * @param value - The value to store (will be JSON stringified)
 * @returns Promise that resolves when the item is stored
 */
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error setting item in storage (key: ${key}):`, error);
    throw error;
  }
};

/**
 * Removes an item from AsyncStorage
 * @param key - The storage key to remove
 * @returns Promise that resolves when the item is removed
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from storage (key: ${key}):`, error);
    throw error;
  }
};

/**
 * Clears all items from AsyncStorage
 * @returns Promise that resolves when all items are cleared
 */
export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};
