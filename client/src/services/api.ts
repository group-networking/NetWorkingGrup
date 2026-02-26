import type { NetworkConfig, NetworkStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ClientHints {
  connectionType?: string;
  downlink?: number;
  online?: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.errors?.join(', ') || payload?.message || 'Falha na API';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getNetworkConfig(): Promise<NetworkConfig> {
  const data = await request<{ config: NetworkConfig }>('/network/config');
  return data.config;
}

export async function updateNetworkConfig(config: NetworkConfig): Promise<NetworkConfig> {
  const data = await request<{ config: NetworkConfig }>('/network/config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });

  return data.config;
}

export async function getNetworkStatus(hints?: ClientHints): Promise<NetworkStatus> {
  const headers: Record<string, string> = {};

  if (typeof hints?.connectionType === 'string' && hints.connectionType.trim().length > 0) {
    headers['x-client-connection-type'] = hints.connectionType;
  }

  if (typeof hints?.downlink === 'number' && Number.isFinite(hints.downlink)) {
    headers['x-client-downlink'] = hints.downlink.toString();
  }

  if (typeof hints?.online === 'boolean') {
    headers['x-client-online'] = String(hints.online);
  }

  const data = await request<{ status: NetworkStatus }>('/network/status', { headers });
  return data.status;
}
