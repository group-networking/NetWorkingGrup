import type { UserInfo as UserInfoType } from '../../types';
import './UserInfo.css';

interface UserInfoProps {
  user: UserInfoType;
  onChangePassword: () => void;
  onViewLogs: () => void;
}

export function UserInfo({ user, onChangePassword, onViewLogs }: UserInfoProps) {
  return (
    <div className="user-info">
      <h1>Net User</h1>
      <span className="user-info-subtitle">Informações do usuário da rede</span>
      
      <ul className="user-list">
        <li>
          <strong>Nome de usuário:</strong> 
          <span>{user.username}</span>
        </li>
        <li>
          <strong>Senha:</strong> 
          <span>{user.password}</span>
        </li>
        <li>
          <strong>Grupo:</strong> 
          <span>{user.group}</span>
        </li>
        <li>
          <strong>Último login:</strong> 
          <span>{user.lastLogin}</span>
        </li>
      </ul>

      <div className="user-actions">
        <button onClick={onChangePassword} className="btn-primary">
          Alterar Senha
        </button>
        <button onClick={onViewLogs} className="btn-secondary">
          Ver Logs de Acesso
        </button>
      </div>
    </div>
  );
}
