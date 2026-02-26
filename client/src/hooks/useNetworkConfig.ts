import { useState, useCallback, useEffect } from 'react';
import type { NetworkConfig } from '../types';
import { getNetworkConfig, updateNetworkConfig } from '../services/api';

const DEFAULT_CONFIG: NetworkConfig = {
  profileName: 'Perfil Principal',
  adapterName: 'Auto',
  mode: 'dhcp',
  ip: '192.168.1.100',
  mask: '255.255.255.0',
  gateway: '192.168.1.1',
  dnsPrimary: '1.1.1.1',
  dnsSecondary: '8.8.8.8',
  mtu: 1500,
  bandwidthLimitMbps: 0,
  proxyEnabled: false,
  proxyUrl: ''
};

const STORAGE_KEY = 'networkConfig';

export function useNetworkConfig() {
  const [config, setConfig] = useState<NetworkConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CONFIG;

    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFromApi = async () => {
      try {
        const apiConfig = await getNetworkConfig();
        if (!active) return;

        const merged = { ...DEFAULT_CONFIG, ...apiConfig };
        setConfig(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // fallback silencioso para operação local
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFromApi();

    return () => {
      active = false;
    };
  }, []);

  const saveConfig = useCallback(async (newConfig: NetworkConfig) => {
    const normalized = { ...DEFAULT_CONFIG, ...newConfig };

    setConfig(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    try {
      const saved = await updateNetworkConfig(normalized);
      const merged = { ...DEFAULT_CONFIG, ...saved };
      setConfig(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return { ok: true as const, config: merged };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao salvar no servidor';
      return { ok: false as const, error: message };
    }
  }, []);

  const resetConfig = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULT_CONFIG);
  }, []);

  return { config, saveConfig, resetConfig, loading };
}

export function validateIP(ip: string): boolean {
  const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
  return regex.test(ip);
}

export function validateNetworkConfig(config: NetworkConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.profileName.trim().length < 3) {
    errors.push('Nome do perfil deve ter no minimo 3 caracteres');
  }

  if (config.mode === 'static') {
    if (!validateIP(config.ip)) errors.push('Endereco IP invalido');
    if (!validateIP(config.mask)) errors.push('Mascara de sub-rede invalida');
    if (!validateIP(config.gateway)) errors.push('Gateway invalido');
  }

  if (!validateIP(config.dnsPrimary)) {
    errors.push('DNS primario invalido');
  }

  if (config.dnsSecondary && !validateIP(config.dnsSecondary)) {
    errors.push('DNS secundario invalido');
  }

  if (!Number.isInteger(config.mtu) || config.mtu < 576 || config.mtu > 9000) {
    errors.push('MTU deve estar entre 576 e 9000');
  }

  if (config.bandwidthLimitMbps < 0) {
    errors.push('Limite de banda nao pode ser negativo');
  }

  if (config.proxyEnabled) {
    try {
      new URL(config.proxyUrl);
    } catch {
      errors.push('URL de proxy invalida');
    }
  }

  return { valid: errors.length === 0, errors };
}
