import { useEffect, useState } from 'react';
import type { NetworkConfig as NetworkConfigType } from '../../types';
import { validateNetworkConfig } from '../../hooks';
import './NetworkConfig.css';

interface NetworkConfigProps {
  config: NetworkConfigType;
  onSave: (config: NetworkConfigType) => Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string } | void;
}

export function NetworkConfig({ config, onSave }: NetworkConfigProps) {
  const [formData, setFormData] = useState<NetworkConfigType>(config);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleChange = <K extends keyof NetworkConfigType>(field: K, value: NetworkConfigType[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const validation = validateNetworkConfig(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      setSaving(false);
      return;
    }

    const result = await Promise.resolve(onSave(formData));

    if (result && result.ok === false) {
      setErrors([result.error || 'Falha ao salvar configuracoes']);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setErrors([]);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const isStatic = formData.mode === 'static';

  return (
    <div className="network-config">
      <h2>Configuracoes de Rede</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="profileName">Perfil:</label>
            <input
              type="text"
              id="profileName"
              value={formData.profileName}
              onChange={(e) => handleChange('profileName', e.target.value)}
              placeholder="Perfil Principal"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adapterName">Adaptador:</label>
            <input
              type="text"
              id="adapterName"
              value={formData.adapterName}
              onChange={(e) => handleChange('adapterName', e.target.value)}
              placeholder="Auto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mode">Modo de Enderecamento:</label>
            <select id="mode" value={formData.mode} onChange={(e) => handleChange('mode', e.target.value as NetworkConfigType['mode'])}>
              <option value="dhcp">DHCP</option>
              <option value="static">IP Estatico</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mtu">MTU:</label>
            <input
              type="number"
              id="mtu"
              value={formData.mtu}
              min={576}
              max={9000}
              onChange={(e) => handleChange('mtu', Number(e.target.value))}
              placeholder="1500"
            />
          </div>
        </div>

        <div className="advanced-section">
          <h3>Configuracao Profissional</h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dnsPrimary">DNS Primario:</label>
              <input
                type="text"
                id="dnsPrimary"
                value={formData.dnsPrimary}
                onChange={(e) => handleChange('dnsPrimary', e.target.value)}
                placeholder="1.1.1.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dnsSecondary">DNS Secundario:</label>
              <input
                type="text"
                id="dnsSecondary"
                value={formData.dnsSecondary}
                onChange={(e) => handleChange('dnsSecondary', e.target.value)}
                placeholder="8.8.8.8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bandwidthLimitMbps">Limite de Banda (Mbps):</label>
              <input
                type="number"
                id="bandwidthLimitMbps"
                min={0}
                value={formData.bandwidthLimitMbps}
                onChange={(e) => handleChange('bandwidthLimitMbps', Number(e.target.value))}
                placeholder="0 = sem limite"
              />
            </div>
          </div>

          <div className="form-grid static-group">
            <div className="form-group">
              <label htmlFor="ipAddress">Endereco IP:</label>
              <input
                type="text"
                id="ipAddress"
                value={formData.ip}
                onChange={(e) => handleChange('ip', e.target.value)}
                placeholder="192.168.1.100"
                disabled={!isStatic}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subnetMask">Mascara de Sub-rede:</label>
              <input
                type="text"
                id="subnetMask"
                value={formData.mask}
                onChange={(e) => handleChange('mask', e.target.value)}
                placeholder="255.255.255.0"
                disabled={!isStatic}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gateway">Gateway:</label>
              <input
                type="text"
                id="gateway"
                value={formData.gateway}
                onChange={(e) => handleChange('gateway', e.target.value)}
                placeholder="192.168.1.1"
                disabled={!isStatic}
              />
            </div>
          </div>

          <div className="checkbox-row">
            <label htmlFor="proxyEnabled">
              <input
                type="checkbox"
                id="proxyEnabled"
                checked={formData.proxyEnabled}
                onChange={(e) => handleChange('proxyEnabled', e.target.checked)}
              />
              Ativar Proxy
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="proxyUrl">URL do Proxy:</label>
            <input
              type="text"
              id="proxyUrl"
              value={formData.proxyUrl}
              onChange={(e) => handleChange('proxyUrl', e.target.value)}
              placeholder="http://proxy.empresa.local:8080"
              disabled={!formData.proxyEnabled}
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error) => (
              <p key={error} className="error">{error}</p>
            ))}
          </div>
        )}

        {success && <div className="success-message">Configuracoes salvas com sucesso!</div>}

        <button type="submit" className="save-button" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configuracoes'}
        </button>
      </form>
    </div>
  );
}
