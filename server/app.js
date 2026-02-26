const express = require('express');
const cors = require('cors');
const dns = require('dns');
const fs = require('fs/promises');
const net = require('net');
const os = require('os');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CONFIG_FILE = path.join(__dirname, 'network-config.json');

const DEFAULT_CONFIG = {
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

const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

app.use(cors());
app.use(express.json());

function isValidIPv4(value) {
  return IPV4_REGEX.test(value);
}

function detectConnectionType(name) {
  const normalized = name.toLowerCase();

  if (/(wi-?fi|wlan|wireless)/.test(normalized)) {
    return 'Wi-Fi';
  }

  if (/(eth|ethernet|en)/.test(normalized)) {
    return 'Ethernet';
  }

  if (/(wwan|cell|mobile|lte|5g|4g)/.test(normalized)) {
    return 'Celular';
  }

  if (/(vpn|tun|tap)/.test(normalized)) {
    return 'VPN';
  }

  return 'Desconhecida';
}

async function readConfig() {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

async function writeConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

function validateConfig(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Payload inválido'];
  }

  if (!['dhcp', 'static'].includes(payload.mode)) {
    errors.push('Modo de configuração inválido');
  }

  if (typeof payload.profileName !== 'string' || payload.profileName.trim().length < 3) {
    errors.push('Nome do perfil deve ter pelo menos 3 caracteres');
  }

  if (payload.mode === 'static') {
    if (!isValidIPv4(payload.ip)) errors.push('IP inválido');
    if (!isValidIPv4(payload.mask)) errors.push('Máscara inválida');
    if (!isValidIPv4(payload.gateway)) errors.push('Gateway inválido');
  }

  if (!isValidIPv4(payload.dnsPrimary)) {
    errors.push('DNS primário inválido');
  }

  if (payload.dnsSecondary && !isValidIPv4(payload.dnsSecondary)) {
    errors.push('DNS secundário inválido');
  }

  const mtu = Number(payload.mtu);
  if (!Number.isFinite(mtu) || mtu < 576 || mtu > 9000) {
    errors.push('MTU deve estar entre 576 e 9000');
  }

  const bandwidthLimitMbps = Number(payload.bandwidthLimitMbps);
  if (!Number.isFinite(bandwidthLimitMbps) || bandwidthLimitMbps < 0 || bandwidthLimitMbps > 100000) {
    errors.push('Limite de banda inválido');
  }

  if (payload.proxyEnabled) {
    try {
      new URL(payload.proxyUrl);
    } catch {
      errors.push('URL de proxy inválida');
    }
  }

  return errors;
}

function findActiveInterface() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) continue;
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        candidates.push({
          name,
          ip: address.address,
          mask: address.netmask
        });
      }
    }
  }

  return candidates[0] || null;
}

function measureLatency(host = '1.1.1.1', port = 53, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const startedAt = Date.now();
    let resolved = false;

    const finish = (latency) => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve(latency);
    };

    socket.setTimeout(timeoutMs);
    socket.on('connect', () => finish(Date.now() - startedAt));
    socket.on('timeout', () => finish(null));
    socket.on('error', () => finish(null));

    socket.connect(port, host);
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/network/config', async (_req, res) => {
  const config = await readConfig();
  res.json({ config });
});

app.put('/api/network/config', async (req, res) => {
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...req.body
  };

  const errors = validateConfig(mergedConfig);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  await writeConfig(mergedConfig);
  return res.json({ ok: true, config: mergedConfig });
});

app.get('/api/network/status', async (req, res) => {
  const active = findActiveInterface();
  const config = await readConfig();
  const latencyMs = await measureLatency();
  const dnsServers = dns.getServers();
  const browserDownlink = Number(req.get('x-client-downlink'));
  const browserType = req.get('x-client-connection-type') || '';
  const browserOnline = req.get('x-client-online');
  const browserConnected = browserOnline === 'true' ? true : browserOnline === 'false' ? false : null;
  const speedFromClient = Number.isFinite(browserDownlink) && browserDownlink > 0 ? Math.round(browserDownlink) : null;

  const connected = browserConnected ?? Boolean(active);
  const connectionType = browserType || (active ? detectConnectionType(active.name) : 'Sem conexão');
  const speed = connected ? speedFromClient ?? 0 : 0;

  res.json({
    status: {
      connected,
      speed,
      connectionType,
      interfaceName: active?.name || 'Não detectada',
      localIp: active?.ip || '0.0.0.0',
      subnetMask: active?.mask || '0.0.0.0',
      gateway: config.gateway,
      dnsServers,
      latencyMs,
      provider: 'Não identificado',
      updatedAt: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de rede ativo em http://localhost:${PORT}`);
});
