import React, { useState } from 'react';
import api from '../services/api';

const Cadastro = ({ onNavigateToLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // Cadastrar via API
      const response = await api.cadastro(usuario, senha);
      
      if (response.success) {
        // Mensagem de sucesso e redirecionar
        localStorage.setItem('mensagemSucesso', 'Usuário cadastrado com sucesso! Faça login.');
        onNavigateToLogin();
      }
    } catch (error) {
      setErro(error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="card">
        <div className="header">
          <div className="icon">📝</div>
          <h1 className="title">Criar Conta</h1>
          <p className="subtitle">Cadastre-se para usar o sistema</p>
        </div>

        {erro && (
          <div className="alert alert-error">
            {erro}
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
              placeholder="Escolha um usuário (min. 3 caracteres)"
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
              placeholder="Escolha uma senha (min. 3 caracteres)"
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <button
            type="button"
            onClick={onNavigateToLogin}
            className="button button-secondary"
          >
            Voltar para login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
