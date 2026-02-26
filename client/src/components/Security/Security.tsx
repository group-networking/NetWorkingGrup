import { useState } from 'react';
import './Security.css';

interface SecurityProps {
  onPasswordChange: () => void;
}

export function Security({ onPasswordChange }: SecurityProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 4) {
      setError('A nova senha deve ter pelo menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Simular alteração de senha
    onPasswordChange();
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="security-panel">
      <h2>Segurança</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Senha Atual:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Digite a senha atual"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Nova Senha:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite a nova senha (mín. 4 caracteres)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nova Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a nova senha"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Senha alterada com sucesso!</div>}

        <button type="submit" className="save-button">
          Alterar Senha
        </button>
      </form>

      <div className="security-info">
        <h3>Informações de Segurança</h3>
        <ul>
          <li>🔒 Sua senha é armazenada localmente</li>
          <li>🔄 Recomenda-se alterar a senha regularmente</li>
          <li>⚠️ Mantenha sua senha segura e não a compartilhe</li>
        </ul>
      </div>
    </div>
  );
}
