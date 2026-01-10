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
    console.error('Error storing session:', err);
    throw err;
  }
};

/**
 * Remove stored session.
 */
const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Error clearing session:', err);
    throw err;
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
    console.error('Error getting stored session:', err);
    return null;
  }
};

/**
 * Login with email and password.
 * On success, store session in secure storage.
 */
export const login = async (email: string, password: string) => {
  try {
    // Always try to delete existing session
    await account.deleteSession('current');
  } catch (err) {
    // It's ok if no session exists; log & proceed.
    if (
      err &&
      typeof err === 'object' &&
      'message' in err
    ) {
      console.warn('No existing session to delete on login:', (err as any).message);
    }
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);
    await storeSession(session);
    return session;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};

/**
 * Register a new user and create a session.
 * On success, store session in secure storage.
 */
export const register = async (email: string, password: string) => {
  try {
    await account.deleteSession('current');
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'message' in err
    ) {
      console.warn('No existing session to delete on register:', (err as any).message);
    }
  }

  try {
    await account.create(ID.unique(), email, password);
    const session = await account.createEmailPasswordSession(email, password);
    await storeSession(session);
    return session;
  } catch (err) {
    console.error('Register failed:', err);
    throw err;
  }
};

/**
 * Logout current session and clear stored session.
 */
export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (err) {
    // User might already be logged out or session expired; log but proceed.
    if (
      err &&
      typeof err === 'object' &&
      'message' in err
    ) {
      console.warn('Error deleting session on logout:', (err as any).message);
    }
  }

  try {
    await clearSession();
  } catch (err) {
    console.error('Error clearing session on logout:', err);
    // Not critical to throw here.
  }
};

/**
 * Get the currently logged in user after validating session.
 * Reads from cache and validates with server.
 */
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (err) {
    try {
      await clearSession();
    } catch (clearErr) {
      console.error('Error clearing session during getCurrentUser:', clearErr);
    }
    console.error('Failed to get current user:', err);
    throw err;
  }
};

/**
 * Checks validity of a session.
 * First checks client-side cached session. Then pings server to confirm validity.
 * Returns true if session is valid, false otherwise.
 */
export const checkSession = async (): Promise<boolean> => {
  const cachedSession = await getStoredSession();
  if (!cachedSession) return false;

  try {
    await account.get();
    return true;
  } catch (err) {
    try {
      await clearSession();
    } catch (clearErr) {
      console.error('Error clearing session during checkSession:', clearErr);
    }
    console.warn('Session check failed:', err);
    return false;
  }
};