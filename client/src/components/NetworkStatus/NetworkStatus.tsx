import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { NetworkStatus as NetworkStatusType, TrafficData } from '../../types';
import './NetworkStatus.css';

Chart.register(...registerables);

interface NetworkStatusProps {
  status: NetworkStatusType;
  trafficData: TrafficData;
}

export function NetworkStatus({ status, trafficData }: NetworkStatusProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trafficData.labels,
        datasets: [{
          label: 'Uso de Rede (Mbps)',
          data: trafficData.values,
          borderColor: '#0078d4',
          backgroundColor: 'rgba(0, 120, 212, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#0078d4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        scales: {
          y: {
            beginAtZero: true,
            max: 250,
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8', maxTicksLimit: 8 }
          }
        },
        plugins: {
          legend: { labels: { color: '#e2e8f0' } }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [trafficData]);

  return (
    <div className="network-status">
      <h2>Status da Rede</h2>

      <div className="status-info">
        <div className="status-item">
          <span className="status-label">Conexao:</span>
          <span className={`status-value ${status.connected ? 'connected' : 'disconnected'}`}>
            {status.connected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Velocidade:</span>
          <span className="status-value speed">{status.speed} Mbps</span>
        </div>

        <div className="status-item">
          <span className="status-label">Tipo:</span>
          <span className="status-value">{status.connectionType}</span>
        </div>
      </div>

      <div className="status-grid">
        <div><strong>Adaptador:</strong> {status.interfaceName}</div>
        <div><strong>IP Local:</strong> {status.localIp}</div>
        <div><strong>Mascara:</strong> {status.subnetMask}</div>
        <div><strong>Gateway:</strong> {status.gateway}</div>
        <div><strong>DNS:</strong> {status.dnsServers.length > 0 ? status.dnsServers.join(', ') : 'Nao detectado'}</div>
        <div><strong>Latencia:</strong> {status.latencyMs ?? '-'} ms</div>
        <div><strong>Provedor:</strong> {status.provider}</div>
      </div>

      <h3>Trafego de Rede (Tempo Real)</h3>
      <div className="chart-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
