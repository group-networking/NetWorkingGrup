import { useState, useCallback } from 'react';
import type { LogEntry } from '../types';

const STORAGE_KEY = 'logs';
const MAX_LOGS = 50;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addLog = useCallback((message: string) => {
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: new Date().toLocaleString(),
      message
    };
    
    setLogs(prevLogs => {
      const updated = [newLog, ...prevLogs].slice(0, MAX_LOGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearLogs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
