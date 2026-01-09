import { clear } from '@/lib/manageStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import * as authService from '@/store/services/auth.service';
import { clearAuth, fetchSession, login, register } from '@/store/slices/auth.slice';
import { resetFollows } from '@/store/slices/follow.slice';
import { clearProfile } from '@/store/slices/user.slice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const restoreSession = useCallback(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  const _login = async (email: string, password: string) => {
    dispatch(login({ email, password }));
  };

  const _register = async (email: string, password: string) => {
    dispatch(register({ email, password }));
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await clear(); // Clears all AsyncStorage
      await authService.logout();
      
      // Clear Redux state
      dispatch(clearAuth());
      dispatch(clearProfile());
      dispatch(resetFollows());
    } catch (error) {
      console.error('Error during logout:', error);
      // Still proceed with logout even if clearing fails
      await authService.logout();
      dispatch(clearAuth());
      dispatch(clearProfile());
      dispatch(resetFollows());
    }
  };

  return {
    user,
    loading,
    _login,
    _register,
    logout,
    restoreSession,
  };
};
