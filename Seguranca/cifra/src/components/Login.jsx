import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin, onNavigateToCadastro }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    try {
      // Fazer login via API
      const response = await api.login(usuario, senha);
      
      if (response.success) {
        // Login bem-sucedido
        onLogin(response.user.usuario);
      }
    } catch (error) {
      setErro(error.message || 'Usuário ou senha inválidos!');
    } finally {
      setLoading(false);
    }
  };

  // Exibir mensagem de sucesso se vier do cadastro
  React.useEffect(() => {
    const mensagem = localStorage.getItem('mensagemSucesso');
    if (mensagem) {
      setSucesso(mensagem);
      localStorage.removeItem('mensagemSucesso');
    }
  }, []);

  return (
    <div className="screen-container">
      <div className="card">
        <div className="header">
          <div className="icon">🔐</div>
          <h1 className="title">Cifra de César</h1>
          <p className="subtitle">Faça login para continuar</p>
        </div>

        {erro && (
          <div className="alert alert-error">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label className="label">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="input"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button
            type="button"
            onClick={onNavigateToCadastro}
            className="button button-secondary"
          >
            Criar nova conta
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
