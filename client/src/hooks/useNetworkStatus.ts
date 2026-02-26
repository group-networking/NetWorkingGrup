import { useState, useEffect, useCallback, useRef } from 'react';
import type { NetworkStatus, TrafficData } from '../types';
import { getNetworkStatus } from '../services/api';

const STATUS_INTERVAL = 7000;
const CHART_INTERVAL = 2000;
const MAX_DATA_POINTS = 20;

type BrowserConnection = {
  effectiveType?: string;
  type?: string;
  downlink?: number;
  addEventListener?: (event: string, callback: () => void) => void;
  removeEventListener?: (event: string, callback: () => void) => void;
};

function getBrowserConnection(): BrowserConnection | undefined {
  const nav = navigator as Navigator & {
    connection?: BrowserConnection;
    mozConnection?: BrowserConnection;
    webkitConnection?: BrowserConnection;
  };

  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function normalizeConnectionType(connection?: BrowserConnection): string {
  const raw = (connection?.type || connection?.effectiveType || '').toLowerCase();

  if (raw.includes('wifi') || raw.includes('wlan')) return 'Wi-Fi';
  if (raw.includes('ethernet')) return 'Ethernet';
  if (raw.includes('2g') || raw.includes('3g') || raw.includes('4g') || raw.includes('5g') || raw.includes('cell')) {
    return 'Celular';
  }

  return 'Desconhecida';
}

function parseDownlink(connection?: BrowserConnection): number | undefined {
  if (typeof connection?.downlink === 'number' && Number.isFinite(connection.downlink) && connection.downlink > 0) {
    return Math.round(connection.downlink);
  }
  return undefined;
}

const DEFAULT_STATUS: NetworkStatus = {
  connected: navigator.onLine,
  speed: 0,
  connectionType: normalizeConnectionType(getBrowserConnection()),
  interfaceName: 'Aguardando deteccao',
  localIp: '0.0.0.0',
  subnetMask: '0.0.0.0',
  gateway: '0.0.0.0',
  dnsServers: [],
  latencyMs: null,
  provider: 'Nao identificado',
  updatedAt: new Date().toISOString()
};

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT_STATUS);
  const [trafficData, setTrafficData] = useState<TrafficData>({ labels: [], values: [] });
  const latestSpeedRef = useRef(0);

  const refreshStatus = useCallback(async () => {
    const browserConnection = getBrowserConnection();
    const browserHints = {
      connectionType: normalizeConnectionType(browserConnection),
      downlink: parseDownlink(browserConnection),
      online: navigator.onLine
    };

    try {
      const serverStatus = await getNetworkStatus(browserHints);
      const speed = serverStatus.speed || browserHints.downlink || 0;

      latestSpeedRef.current = speed;
      setStatus({
        ...serverStatus,
        speed,
        connected: navigator.onLine && serverStatus.connected,
        connectionType: browserHints.connectionType || serverStatus.connectionType
      });
    } catch {
      const fallbackSpeed = browserHints.downlink || 0;
      latestSpeedRef.current = fallbackSpeed;

      setStatus((prev) => ({
        ...prev,
        connected: navigator.onLine,
        speed: navigator.onLine ? fallbackSpeed : 0,
        connectionType: browserHints.connectionType || prev.connectionType,
        updatedAt: new Date().toISOString()
      }));
    }
  }, []);

  useEffect(() => {
    refreshStatus();

    const interval = window.setInterval(refreshStatus, STATUS_INTERVAL);

    const handleOnlineState = () => {
      refreshStatus();
    };

    window.addEventListener('online', handleOnlineState);
    window.addEventListener('offline', handleOnlineState);

    const connection = getBrowserConnection();
    connection?.addEventListener?.('change', handleOnlineState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnlineState);
      window.removeEventListener('offline', handleOnlineState);
      connection?.removeEventListener?.('change', handleOnlineState);
    };
  }, [refreshStatus]);

  useEffect(() => {
    const chartTimer = window.setInterval(() => {
      const base = status.connected ? latestSpeedRef.current : 0;
      const jitter = base > 0 ? Math.max(0, Math.round(base * (0.7 + Math.random() * 0.6))) : 0;

      setTrafficData((prev) => {
        const labels = [...prev.labels, new Date().toLocaleTimeString()];
        const values = [...prev.values, jitter];

        if (labels.length > MAX_DATA_POINTS) {
          labels.shift();
          values.shift();
        }

        return { labels, values };
      });
    }, CHART_INTERVAL);

    return () => {
      clearInterval(chartTimer);
    };
  }, [status.connected]);

  return { status, trafficData, refreshStatus };
}
