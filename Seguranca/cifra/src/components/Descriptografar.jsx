import React, { useState } from 'react';
import api from '../services/api';

const Descriptografar = ({ currentUser, onLogout, onNavigateToCriptografar }) => {
  const [mensagemCripto, setMensagemCripto] = useState('');
  const [hash, setHash] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    try {
      // Descriptografar via API
      const response = await api.descriptografar(mensagemCripto, hash);
      
      if (response.success) {
        // Exibir resultado
        setResultado({
          mensagemCriptografada: response.data.mensagemCriptografada,
          mensagemOriginal: response.data.mensagemOriginal,
          passo: response.data.passo
        });

        // Limpar campos
        setMensagemCripto('');
        setHash('');
      }
    } catch (error) {
      setErro(error.message || 'Erro ao descriptografar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="card">
        <div className="header">
          <div className="icon">🔓</div>
          <h1 className="title">Descriptografar</h1>
          <p className="subtitle">Bem-vindo, <strong>{currentUser}</strong>!</p>
        </div>

        <div className="nav-buttons">
          <button
            className="nav-button"
            onClick={onNavigateToCriptografar}
          >
            Criptografar
          </button>
          <button className="nav-button nav-button-active">
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
            <label className="label">Mensagem Criptografada</label>
            <input
              type="text"
              value={mensagemCripto}
              onChange={(e) => setMensagemCripto(e.target.value)}
              className="input"
              placeholder="Cole a mensagem criptografada"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Hash (Chave Única)</label>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="input"
              placeholder="Cole o hash recebido"
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? '🔓 Descriptografando...' : '🔓 Descriptografar'}
          </button>
        </form>

        {resultado && (
          <div className="resultado">
            <h3 className="resultado-title">✅ Descriptografia Realizada!</h3>
            
            <div className="resultado-item">
              <div className="resultado-label">Mensagem Criptografada</div>
              <div className="resultado-value">{resultado.mensagemCriptografada}</div>
            </div>

            <div className="resultado-item">
              <div className="resultado-label">Passo Utilizado</div>
              <div className="resultado-value">{resultado.passo}</div>
            </div>

            <div className="resultado-item">
              <div className="resultado-label">Mensagem Original</div>
              <div className="resultado-value resultado-highlight">{resultado.mensagemOriginal}</div>
            </div>

            <div className="alert alert-success">
              <strong>✅ Sucesso!</strong> A mensagem foi descriptografada com sucesso. 
              O hash foi marcado como usado e não pode mais ser utilizado.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Descriptografar;
