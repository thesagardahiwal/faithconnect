import { account } from '@/lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ID } from 'react-native-appwrite';

const SESSION_KEY = 'user_session';

/**
 * Store session in storage.
 */
const storeSession = async (session: any) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    // Optionally log error or report to monitoring
  }
};

/**
 * Remove stored session.
 */
const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (err) {
    // Optionally log error or report to monitoring
  }
};

/**
 * Retrieve session from storage.
 */
const getStoredSession = async () => {
  try {
    const sessionStr = await AsyncStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (err) {
    return null;
  }
};

/**
 * Login with email and password.
 * On success, store session in secure storage.
 */
export const login = async (email: string, password: string) => {
  const session = await account.createEmailPasswordSession(email, password);
  await storeSession(session);
  return session;
};

/**
 * Register a new user and create a session.
 * On success, store session in secure storage.
 */
export const register = async (email: string, password: string) => {
  await account.create(ID.unique(), email, password);
  const session = await account.createEmailPasswordSession(email, password);
  await storeSession(session);
  return session;
};

/**
 * Logout current session and clear stored session.
 */
export const logout = async () => {
  await account.deleteSession('current');
  await clearSession();
};

/**
 * Get the currently logged in user after validating session.
 * Reads from cache and validates with server.
 */
export const getCurrentUser = async () => {
  // Use a cached user if available and not expired (optional, not in this scope)
  // But always fetch fresh in mission-critical apps
  try {
    const user = await account.get();
    return user;
  } catch (err) {
    await clearSession();
    throw err;
  }
};

/**
 * Checks validity of a session.
 * First checks client-side cached session. Then pings server to confirm validity.
 * Returns true if session is valid, false otherwise.
 */
export const checkSession = async (): Promise<boolean> => {
  // Check if session exists in cache
  const cachedSession = await getStoredSession();
  if (!cachedSession) return false;

  // Try to validate with the server
  try {
    // This will throw if session is invalid or expired on the backend
    await account.get();
    return true;
  } catch (err) {
    // Session expired or invalid, clear cache
    await clearSession();
    return false;
  }
};