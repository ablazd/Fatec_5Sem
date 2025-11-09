import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cipherRoutes from './routes/cipher.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARES
// ========================================

// CORS - Permitir requisições do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (desenvolvimento)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================================
// CONEXÃO COM MONGODB
// ========================================

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado com sucesso!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    console.error('📋 Verifique se:');
    console.error('   1. MongoDB está rodando (localhost:27017)');
    console.error('   2. MONGODB_URI está correto no arquivo .env');
    console.error('   3. Não há firewall bloqueando a conexão');
    process.exit(1);
  }
};

conectarMongoDB();

// Eventos do MongoDB
mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB desconectado');
});

// ========================================
// ROTAS
// ========================================

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API da Cifra de César está funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cipher: '/api/cipher'
    }
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de criptografia (protegidas por JWT)
app.use('/api/cipher', cipherRoutes);

// Rota 404 - Não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// ========================================
// TRATAMENTO DE ERROS GLOBAL
// ========================================

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints disponíveis:`);
  console.log(`   POST   /api/auth/cadastro - Cadastrar usuário`);
  console.log(`   POST   /api/auth/login - Fazer login`);
  console.log(`   GET    /api/auth/verificar - Verificar token`);
  console.log(`   POST   /api/cipher/criptografar - Criptografar mensagem`);
  console.log(`   POST   /api/cipher/descriptografar - Descriptografar mensagem`);
  console.log(`   GET    /api/cipher/historico - Histórico de hashes\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT recebido. Encerrando servidor...');
  mongoose.connection.close();
  process.exit(0);
});

export default app;
