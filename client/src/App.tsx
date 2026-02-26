import { useState, useEffect } from 'react';
import {
  Sidebar,
  UserInfo,
  NetworkConfig,
  NetworkStatus,
  LogsPanel,
  Security
} from './components';
import { useNetworkConfig, useLogs, useUser, useNetworkStatus } from './hooks';
import type { NetworkConfig as NetworkConfigType } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('usuario');
  const [logsVisible, setLogsVisible] = useState(false);

  const { config, saveConfig, loading } = useNetworkConfig();
  const { logs, addLog } = useLogs();
  const { user, changePassword, updateLastLogin } = useUser();
  const { status, trafficData } = useNetworkStatus();

  useEffect(() => {
    addLog('Login realizado com sucesso');
    updateLastLogin();
  }, [addLog, updateLastLogin]);

  const handleSaveConfig = async (newConfig: NetworkConfigType) => {
    const result = await saveConfig(newConfig);

    if (result.ok) {
      addLog('Configuracoes de rede alteradas');
      return { ok: true };
    }

    addLog(`Falha ao salvar configuracoes: ${result.error}`);
    return { ok: false, error: result.error };
  };

  const handlePasswordChange = () => {
    const newPassword = prompt('Digite a nova senha:');
    if (newPassword && changePassword(newPassword)) {
      addLog('Senha alterada');
      alert('Senha alterada com sucesso!');
    } else if (newPassword) {
      alert('Senha muito curta!');
    }
  };

  const handleViewLogs = () => {
    setLogsVisible((prev) => !prev);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'usuario':
        return (
          <>
            <UserInfo
              user={user}
              onChangePassword={handlePasswordChange}
              onViewLogs={handleViewLogs}
            />
            <NetworkConfig config={config} onSave={handleSaveConfig} />
            <NetworkStatus status={status} trafficData={trafficData} />
            <LogsPanel
              logs={logs}
              isVisible={logsVisible}
              onToggle={handleViewLogs}
            />
          </>
        );
      case 'rede':
        return (
          <>
            <NetworkConfig config={config} onSave={handleSaveConfig} />
            <NetworkStatus status={status} trafficData={trafficData} />
          </>
        );
      case 'seguranca':
        return <Security onPasswordChange={handlePasswordChange} />;
      case 'logs':
        return (
          <LogsPanel
            logs={logs}
            isVisible={true}
            onToggle={() => setLogsVisible(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {loading && <p>Carregando configuracoes...</p>}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
