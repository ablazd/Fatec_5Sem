import React, { useState } from 'react';
import api from '../services/api';

const Criptografar = ({ currentUser, onLogout, onNavigateToDescriptografar }) => {
  const [mensagem, setMensagem] = useState('');
  const [passo, setPasso] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    try {
      // Criptografar via API
      const response = await api.criptografar(mensagem, parseInt(passo));
      
      if (response.success) {
        // Exibir resultado
        setResultado({
          mensagemOriginal: response.data.mensagemOriginal,
          mensagemCifrada: response.data.mensagemCifrada,
          hash: response.data.hash,
          passo: response.data.passo
        });

        // Limpar campos
        setMensagem('');
        setPasso('');
      }
    } catch (error) {
      setErro(error.message || 'Erro ao criptografar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="card">
        <div className="header">
          <div className="icon">🔒</div>
          <h1 className="title">Criptografar</h1>
          <p className="subtitle">Bem-vindo, <strong>{currentUser}</strong>!</p>
        </div>

        <div className="nav-buttons">
          <button className="nav-button nav-button-active">
            Criptografar
          </button>
          <button
            className="nav-button"
            onClick={onNavigateToDescriptografar}
          >
            Descriptografar
          </button>
          <button
            className="nav-button"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>

        {erro && (
          <div className="alert alert-error">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label className="label">Mensagem (apenas a-z e 0-9)</label>
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="input"
              placeholder="Digite a mensagem (ex: hello123)"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Passo (número inteiro)</label>
            <input
              type="number"
              value={passo}
              onChange={(e) => setPasso(e.target.value)}
              className="input"
              placeholder="Ex: 3"
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? '🔒 Criptografando...' : '🔒 Criptografar'}
          </button>
        </form>

        {resultado && (
          <div className="resultado">
            <h3 className="resultado-title">✅ Criptografia Realizada!</h3>
            
            <div className="resultado-item">
              <div className="resultado-label">Mensagem Original</div>
              <div className="resultado-value">{resultado.mensagemOriginal}</div>
            </div>

            <div className="resultado-item">
              <div className="resultado-label">Mensagem Criptografada</div>
              <div className="resultado-value resultado-highlight">{resultado.mensagemCifrada}</div>
            </div>

            <div className="resultado-item">
              <div className="resultado-label">Hash (Chave Única)</div>
              <div className="resultado-value resultado-highlight">{resultado.hash}</div>
            </div>

            <div className="alert alert-success">
              <strong>⚠️ IMPORTANTE:</strong> Guarde o hash e a mensagem criptografada! 
              O hash é necessário para descriptografar e pode ser usado apenas uma vez.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Criptografar;
