import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * Gera um JWT token
 */
const gerarToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * POST /api/auth/cadastro
 * Registra um novo usuário
 */
router.post('/cadastro', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Validações
    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios.'
      });
    }

    if (usuario.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'O usuário deve ter pelo menos 3 caracteres.'
      });
    }

    if (senha.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 3 caracteres.'
      });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await User.findOne({ usuario });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Este usuário já existe! Escolha outro nome.'
      });
    }

    // Criar novo usuário (senha será hasheada automaticamente pelo pre-save hook)
    const novoUsuario = new User({
      usuario,
      senha
    });

    await novoUsuario.save();

    // Gerar token JWT
    const token = gerarToken(novoUsuario._id);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: {
        id: novoUsuario._id,
        usuario: novoUsuario.usuario
      }
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário.',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Autentica um usuário e retorna JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Validações
    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios.'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ usuario });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos!'
      });
    }

    // Verificar senha
    const senhaCorreta = await user.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos!'
      });
    }

    // Gerar token JWT
    const token = gerarToken(user._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user._id,
        usuario: user.usuario
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/verificar
 * Verifica se o token JWT é válido (requer autenticação)
 */
router.get('/verificar', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-senha');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        usuario: user.usuario
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado.'
    });
  }
});

export default router;
