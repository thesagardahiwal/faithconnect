import { account } from '@/src/lib/appwrite';

export const login = (email: string, password: string) =>
  account.createEmailSession(email, password);

export const register = (email: string, password: string) =>
  account.create(email, password);

export const logout = () => account.deleteSession('current');

export const getCurrentUser = () => account.get();
