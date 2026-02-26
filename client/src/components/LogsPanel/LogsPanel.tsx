import type { LogEntry } from '../../types';
import './LogsPanel.css';

interface LogsPanelProps {
  logs: LogEntry[];
  isVisible: boolean;
  onToggle: () => void;
}

export function LogsPanel({ logs, isVisible, onToggle }: LogsPanelProps) {
  return (
    <div className={`logs-panel ${isVisible ? 'visible' : ''}`}>
      <div className="logs-header">
        <h2>Logs de Acesso</h2>
        <button className="toggle-btn" onClick={onToggle}>
          {isVisible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      
      {isVisible && (
        <div className="logs-content">
          {logs.length === 0 ? (
            <p className="no-logs">Nenhum log registrado.</p>
          ) : (
            <ul className="logs-list">
              {logs.map(log => (
                <li key={log.id}>
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-message">{log.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
