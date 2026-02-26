import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'usuario', label: 'Usuário', icon: '👤' },
  { id: 'rede', label: 'Rede', icon: '🌐' },
  { id: 'seguranca', label: 'Segurança', icon: '🔒' },
  { id: 'logs', label: 'Logs', icon: '📋' }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Net Admin</h2>
      <nav>
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a 
                href="#" 
                className={activeTab === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(item.id);
                }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
