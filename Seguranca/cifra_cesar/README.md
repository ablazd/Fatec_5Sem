# 🔐 Backend - Cifra de César API

Backend da aplicação de Cifra de César com Node.js, Express, MongoDB e JWT.

## 🚀 Inicialização Rápida

```powershell
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Edite o arquivo .env com suas configurações

# 3. Iniciar o servidor
npm start
```

## 📦 Dependências

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Geração e validação de JWT
- **bcryptjs**: Hash de senhas
- **cors**: Middleware CORS
- **dotenv**: Variáveis de ambiente

## 🔧 Variáveis de Ambiente (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cifra_cesar
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

## 📂 Estrutura

```
cifra_cesar/
├── models/
│   ├── User.js          # Schema de usuários
│   └── Hash.js          # Schema de hashes de criptografia
├── routes/
│   ├── auth.js          # Rotas de autenticação
│   └── cipher.js        # Rotas de criptografia
├── middleware/
│   └── auth.js          # Middleware JWT
├── server.js            # Servidor principal
├── package.json
└── .env
```

## 🔌 Endpoints

### Autenticação
- `POST /api/auth/cadastro` - Cadastrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verificar` - Verificar token

### Criptografia (Requer JWT)
- `POST /api/cipher/criptografar` - Criptografar mensagem
- `POST /api/cipher/descriptografar` - Descriptografar mensagem
- `GET /api/cipher/historico` - Histórico de hashes

## 🗄️ MongoDB

Certifique-se de que o MongoDB está rodando:

```powershell
# Windows - Iniciar serviço
net start MongoDB

# Ou use MongoDB Atlas (cloud)
# Atualize MONGODB_URI no .env
```

## 🧪 Testar API

```powershell
# Health check
curl http://localhost:5000

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{\"usuario\":\"admin\",\"senha\":\"123\"}'
```

## 📝 Scripts

```powershell
npm start      # Iniciar servidor
npm run dev    # Iniciar com hot-reload (Node 18+)
```
