import { useState, useCallback } from 'react';
import type { UserInfo } from '../types';

const DEFAULT_USER: UserInfo = {
  username: 'netuser',
  password: '********',
  group: 'Administradores',
  lastLogin: new Date().toLocaleString()
};

const USER_STORAGE_KEY = 'userInfo';
const PASSWORD_KEY = 'userPassword';

export function useUser() {
  const [user, setUser] = useState<UserInfo>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_USER;
  });

  const changePassword = useCallback((newPassword: string): boolean => {
    if (newPassword.length < 4) {
      return false;
    }
    
    localStorage.setItem(PASSWORD_KEY, newPassword);
    
    setUser(prev => {
      const updated = { ...prev, password: '********' };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    
    return true;
  }, []);

  const updateLastLogin = useCallback(() => {
    setUser(prev => {
      const updated = { ...prev, lastLogin: new Date().toLocaleString() };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { user, changePassword, updateLastLogin };
}
