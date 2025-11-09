import express from 'express';
import crypto from 'crypto';
import Hash from '../models/Hash.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * Função para aplicar Cifra de César
 */
const cifrarCesar = (texto, shift) => {
  return texto.split('').map(char => {
    if (/[a-z]/.test(char)) {
      // Letras minúsculas (a-z)
      return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26 + 26) % 26 + 97);
    } else if (/[A-Z]/.test(char)) {
      // Letras maiúsculas (A-Z)
      return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
    } else if (/[0-9]/.test(char)) {
      // Números (0-9)
      return String.fromCharCode(((char.charCodeAt(0) - 48 + shift) % 10 + 10) % 10 + 48);
    }
    return char;
  }).join('');
};

/**
 * Função para descriptografar Cifra de César
 */
const decifrarCesar = (texto, shift) => {
  return cifrarCesar(texto, -shift);
};

/**
 * Gerar hash alfanumérico único
 */
const gerarHash = () => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}${random}`.toUpperCase();
};

/**
 * POST /api/cipher/criptografar
 * Criptografa uma mensagem usando Cifra de César
 * Requer autenticação JWT
 */
router.post('/criptografar', auth, async (req, res) => {
  try {
    const { mensagem, passo } = req.body;
    const usuarioId = req.userId;

    // Validações
    if (!mensagem || passo === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem e passo são obrigatórios.'
      });
    }

    // Validar que mensagem contém apenas a-z, A-Z, 0-9
    if (!/^[a-zA-Z0-9]+$/.test(mensagem)) {
      return res.status(400).json({
        success: false,
        message: 'A mensagem deve conter apenas letras (a-z) e números (0-9)!'
      });
    }

    // Validar passo
    const passoInt = parseInt(passo);
    if (isNaN(passoInt)) {
      return res.status(400).json({
        success: false,
        message: 'O passo deve ser um número inteiro!'
      });
    }

    // Criptografar mensagem
    const mensagemCifrada = cifrarCesar(mensagem, passoInt);

    // Gerar hash único
    let hash = gerarHash();
    
    // Garantir que o hash é único
    let hashExiste = await Hash.findOne({ hash });
    while (hashExiste) {
      hash = gerarHash();
      hashExiste = await Hash.findOne({ hash });
    }

    // Salvar hash no banco de dados
    const novoHash = new Hash({
      hash,
      passo: passoInt,
      usado: false,
      usuarioId
    });

    await novoHash.save();

    // Retornar resultado
    res.status(201).json({
      success: true,
      message: 'Mensagem criptografada com sucesso!',
      data: {
        mensagemOriginal: mensagem,
        mensagemCifrada,
        hash,
        passo: passoInt
      }
    });
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criptografar mensagem.',
      error: error.message
    });
  }
});

/**
 * POST /api/cipher/descriptografar
 * Descriptografa uma mensagem usando hash único
 * Requer autenticação JWT
 * O hash só pode ser usado uma vez
 */
router.post('/descriptografar', auth, async (req, res) => {
  try {
    const { mensagemCripto, hash } = req.body;

    // Validações
    if (!mensagemCripto || !hash) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem criptografada e hash são obrigatórios.'
      });
    }

    // Buscar hash no banco de dados
    const hashDoc = await Hash.findOne({ hash });

    if (!hashDoc) {
      return res.status(404).json({
        success: false,
        message: 'Hash inválido!'
      });
    }

    // Verificar se hash já foi usado
    if (hashDoc.usado) {
      return res.status(403).json({
        success: false,
        message: 'Este hash já foi utilizado!',
        usadoEm: hashDoc.usadoEm
      });
    }

    // Descriptografar mensagem
    const mensagemOriginal = decifrarCesar(mensagemCripto, hashDoc.passo);

    // Marcar hash como usado
    hashDoc.usado = true;
    hashDoc.usadoEm = new Date();
    await hashDoc.save();

    // Retornar resultado
    res.json({
      success: true,
      message: 'Mensagem descriptografada com sucesso!',
      data: {
        mensagemCriptografada: mensagemCripto,
        mensagemOriginal,
        passo: hashDoc.passo
      }
    });
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao descriptografar mensagem.',
      error: error.message
    });
  }
});

/**
 * GET /api/cipher/historico
 * Retorna o histórico de hashes do usuário
 * Requer autenticação JWT
 */
router.get('/historico', auth, async (req, res) => {
  try {
    const usuarioId = req.userId;

    const hashes = await Hash.find({ usuarioId })
      .sort({ criadoEm: -1 })
      .select('hash passo usado criadoEm usadoEm')
      .limit(50);

    res.json({
      success: true,
      data: hashes
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico.',
      error: error.message
    });
  }
});

export default router;
