import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Criptografar from './components/Criptografar';
import Descriptografar from './components/Descriptografar';
import api from './services/api';
import './styles.css';

function App() {
  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário já está autenticado ao carregar o app
  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = api.getToken();
      
      if (token) {
        const valido = await api.verificarToken();
        
        if (valido) {
          const usuario = api.getUsuario();
          if (usuario) {
            setCurrentUser(usuario.usuario);
            setScreen('criptografar');
          }
        } else {
          api.logout();
        }
      }
      
      setLoading(false);
    };

    verificarAutenticacao();
  }, []);

  // Handlers de navegação
  const handleLogin = (usuario) => {
    setCurrentUser(usuario);
    setScreen('criptografar');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setScreen('login');
  };

  const navigateToLogin = () => {
    setScreen('login');
  };

  const navigateToCadastro = () => {
    setScreen('cadastro');
  };

  const navigateToCriptografar = () => {
    setScreen('criptografar');
  };

  const navigateToDescriptografar = () => {
    setScreen('descriptografar');
  };

  // Tela de carregamento inicial
  if (loading) {
    return (
      <div className="screen-container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="icon">⏳</div>
          <h2 style={{ color: 'var(--red-600)' }}>Carregando...</h2>
        </div>
      </div>
    );
  }

  // Renderizar tela apropriada
  return (
    <div className="app">
      {screen === 'login' && (
        <Login
          onLogin={handleLogin}
          onNavigateToCadastro={navigateToCadastro}
        />
      )}

      {screen === 'cadastro' && (
        <Cadastro
          onNavigateToLogin={navigateToLogin}
        />
      )}

      {screen === 'criptografar' && (
        <Criptografar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToDescriptografar={navigateToDescriptografar}
        />
      )}

      {screen === 'descriptografar' && (
        <Descriptografar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToCriptografar={navigateToCriptografar}
        />
      )}
    </div>
  );
}

export default App;
