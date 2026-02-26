// Tipos para o sistema de rede

export interface NetworkConfig {
  profileName: string;
  adapterName: string;
  mode: 'dhcp' | 'static';
  ip: string;
  mask: string;
  gateway: string;
  dnsPrimary: string;
  dnsSecondary: string;
  mtu: number;
  bandwidthLimitMbps: number;
  proxyEnabled: boolean;
  proxyUrl: string;
}

export interface UserInfo {
  username: string;
  password: string;
  group: string;
  lastLogin: string;
}

export interface NetworkStatus {
  connected: boolean;
  speed: number;
  connectionType: string;
  interfaceName: string;
  localIp: string;
  subnetMask: string;
  gateway: string;
  dnsServers: string[];
  latencyMs: number | null;
  provider: string;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface TrafficData {
  labels: string[];
  values: number[];
}
