import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware de autenticação JWT
 * Verifica e valida o token JWT enviado no header Authorization
 * Garante Autenticidade, Integridade e Confidencialidade
 */
const auth = async (req, res, next) => {
  try {
    // Obter token do header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. Token não fornecido.'
      });
    }

    // Extrair o token (remover 'Bearer ')
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. Token inválido.'
      });
    }

    try {
      // Verificar e decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuário no banco
      const user = await User.findById(decoded.id).select('-senha');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado. Token inválido.'
        });
      }

      // Adicionar usuário ao request para uso nas rotas
      req.user = user;
      req.userId = decoded.id;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado. Faça login novamente.'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido.'
        });
      }

      throw jwtError;
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor durante autenticação.'
    });
  }
};

export default auth;
