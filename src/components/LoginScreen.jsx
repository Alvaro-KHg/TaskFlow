import React, { useState } from 'react';
import { USERS } from '../data/mockData';
import { CheckCircle2, LogIn, ChevronDown } from 'lucide-react';
import './LoginScreen.css';

// Senhas internas pré-definidas por usuário
const USER_PASSWORDS = {
  'u1': 'alvaro123',   // Alvaro
  'u2': 'bruno123',    // Bruno
  'u3': 'fernando123', // Fernando
  'u4': 'kaique123',   // Kaique
  'u5': 'borges123',   // Borges
  'u6': 'rafaela123',  // Rafaela
};

const LoginScreen = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedUser = USERS.find(u => u.id === selectedUserId);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setError('Selecione seu nome para continuar.');
      return;
    }

    if (!password) {
      setError('Digite sua senha.');
      return;
    }

    if (USER_PASSWORDS[selectedUserId] !== password) {
      setError('Senha incorreta. Tente novamente.');
      return;
    }

    // Login bem-sucedido! Salva no localStorage para manter a sessão
    localStorage.setItem('taskflow_user', selectedUserId);
    onLogin(selectedUserId);
  };

  return (
    <div className="login-screen">
      <div className="login-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <CheckCircle2 size={48} color="#3b82f6" />
        </div>
        <h1 className="login-title">TaskFlow</h1>
        <p className="login-subtitle">Data Rangers</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Custom Dropdown de Seleção de Usuário */}
          <div className="form-group-login">
            <label className="login-label">Quem é você?</label>
            <div className="custom-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className={`dropdown-trigger ${selectedUser ? 'has-value' : ''}`}>
                {selectedUser ? (
                  <div className="dropdown-selected">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="dropdown-avatar" />
                    <span className="dropdown-name">{selectedUser.name}</span>
                  </div>
                ) : (
                  <span className="dropdown-placeholder">Selecione seu nome...</span>
                )}
                <ChevronDown size={18} className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="dropdown-options">
                  {USERS.map(user => (
                    <div
                      key={user.id}
                      className={`dropdown-option ${selectedUserId === user.id ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleSelectUser(user.id); }}
                    >
                      <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Campo de Senha */}
          <div className="form-group-login">
            <label className="login-label">Senha</label>
            <input
              type="password"
              className="login-input"
              placeholder="Digite sua senha..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            <LogIn size={20} />
            Entrar
          </button>
        </form>

        <p className="login-footer-text">Sistema de Gestão de Tarefas Acadêmicas</p>
      </div>
    </div>
  );
};

export default LoginScreen;
