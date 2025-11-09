/**
 * Serviço de comunicação com a API Backend
 * Gerencia autenticação JWT e requisições HTTP
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Classe para gerenciar a API
 */
class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Obtém o token JWT do localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Salva o token JWT no localStorage
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Remove o token JWT do localStorage
   */
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  /**
   * Obtém o usuário logado do localStorage
   */
  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  /**
   * Salva o usuário no localStorage
   */
  setUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  /**
   * Método genérico para fazer requisições
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configurações padrão
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token JWT se disponível
    const token = this.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Se token inválido ou expirado, limpar localStorage
        if (response.status === 401) {
          this.removeToken();
        }
        
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS DE AUTENTICAÇÃO
  // ========================================

  /**
   * Cadastro de novo usuário
   */
  async cadastro(usuario, senha) {
    const data = await this.request('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ usuario, senha }),
    });

    if (data.success && data.token) {
      this.setToken(data.token);
      this.setUsuario(data.user);
    }

    return data;
  }

  /**
   * Login de usuário
   */
  async login(usuario, senha) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, senha }),
    });

    if (data.success && data.token) {
      this.setToken(data.token);
      this.setUsuario(data.user);
    }

    return data;
  }

  /**
   * Verificar se token é válido
   */
  async verificarToken() {
    try {
      const data = await this.request('/auth/verificar');
      if (data.success && data.user) {
        this.setUsuario(data.user);
        return true;
      }
      return false;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  /**
   * Logout
   */
  logout() {
    this.removeToken();
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  // ========================================
  // MÉTODOS DE CRIPTOGRAFIA
  // ========================================

  /**
   * Criptografar mensagem
   */
  async criptografar(mensagem, passo) {
    return await this.request('/cipher/criptografar', {
      method: 'POST',
      body: JSON.stringify({ mensagem, passo }),
    });
  }

  /**
   * Descriptografar mensagem
   */
  async descriptografar(mensagemCripto, hash) {
    return await this.request('/cipher/descriptografar', {
      method: 'POST',
      body: JSON.stringify({ mensagemCripto, hash }),
    });
  }

  /**
   * Obter histórico de hashes
   */
  async getHistorico() {
    return await this.request('/cipher/historico');
  }
}

// Exportar instância única (singleton)
const api = new ApiService();
export default api;
