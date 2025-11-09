# 🔐 Cifra de César - Sistema Completo com JWT e MongoDB

Sistema web completo de criptografia usando **Cifra de César** com autenticação JWT, backend Node.js + Express, banco de dados MongoDB e frontend React.

## 🎨 Design

- **Estilo**: Minimalista e limpo
- **Paleta de Cores**: Tons de vermelho forte para ações principais, com fundo neutro (branco, cinza claro e preto)
- **Responsivo**: Interface adaptável para desktop e mobile

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**
- **MongoDB** com **Mongoose**
- **JWT (JSON Web Tokens)** para autenticação
- **bcryptjs** para hash de senhas
- **CORS** para integração frontend/backend

### Frontend
- **React 18** com Hooks
- **Vite** para build rápido
- **CSS Moderno** com variáveis CSS

---

## 📋 Funcionalidades

### 🔐 Segurança (Requisitos Atendidos)

1. **Autenticação com JWT**
   - Tokens JWT garantem **Autenticidade**, **Integridade** e **Confidencialidade**
   - Senhas protegidas com bcrypt (hash + salt)
   - Tokens validados em todas as requisições protegidas

2. **Hash de Uso Único**
   - Cada criptografia gera um hash alfanumérico único
   - O hash só pode ser usado **uma vez** para descriptografar
   - Validação no banco de dados com flag `usado`

### 📱 Telas Principais

#### 1. **Login** (`/login`)
- Autenticação de usuários existentes
- Geração de token JWT após login bem-sucedido
- Feedback de erros claros

#### 2. **Cadastro** (`/cadastro`)
- Registro de novos usuários
- Validação de campos (mínimo 3 caracteres)
- Verificação de usuário duplicado

#### 3. **Criptografar** (`/criptografar`)
- Input: Mensagem (a-z, A-Z, 0-9) e Passo (número inteiro)
- Processamento: Aplicação da Cifra de César
- Output:
  - Mensagem criptografada
  - Hash único (chave privada)
- Hash armazenado no MongoDB com `usado = false`

#### 4. **Descriptografar** (`/descriptografar`)
- Input: Mensagem criptografada e Hash
- Validações:
  - Hash existe no banco?
  - Hash já foi usado?
- Output:
  - Mensagem original (texto claro)
  - Hash marcado como `usado = true` automaticamente

---

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **MongoDB** (local ou Atlas)
- **npm** ou **yarn**

### 1️⃣ Configurar o Backend

```powershell
# Navegar para a pasta do backend
cd cifra_cesar

# Instalar dependências
npm install

# Criar arquivo .env (copiar do .env.example)
Copy-Item .env.example .env

# Editar o arquivo .env com suas configurações
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/cifra_cesar
# JWT_SECRET=seu_segredo_super_secreto_aqui

# Iniciar o servidor
npm start
```

O backend estará rodando em: `http://localhost:5000`

### 2️⃣ Configurar o Frontend

```powershell
# Navegar para a pasta do frontend
cd ../cifra

# Instalar dependências
npm install

# Criar arquivo .env (opcional - backend local)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

---

## 🗄️ Banco de Dados MongoDB

### Schemas

#### **User** (Usuários)
```javascript
{
  usuario: String (único, min: 3),
  senha: String (hasheada com bcrypt),
  criadoEm: Date,
  timestamps: true
}
```

#### **Hash** (Controle de Criptografias)
```javascript
{
  hash: String (único, alfanumérico),
  passo: Number (shift da cifra),
  usado: Boolean (default: false),
  usuarioId: ObjectId (ref: User),
  criadoEm: Date,
  usadoEm: Date (quando usado),
  timestamps: true
}
```

---

## 🔒 API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/cadastro` | Cadastrar novo usuário | ❌ |
| POST | `/login` | Fazer login e receber JWT | ❌ |
| GET | `/verificar` | Verificar se token é válido | ✅ |

### Criptografia (`/api/cipher`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/criptografar` | Criptografar mensagem | ✅ |
| POST | `/descriptografar` | Descriptografar mensagem | ✅ |
| GET | `/historico` | Ver histórico de hashes | ✅ |

**Auth** ✅ = Requer token JWT no header: `Authorization: Bearer <token>`

---

## 🔐 Como Funciona o JWT

1. **Cadastro/Login**: Usuário se autentica → Servidor gera JWT
2. **Armazenamento**: Token salvo no `localStorage` do navegador
3. **Requisições**: Token enviado no header `Authorization: Bearer <token>`
4. **Validação**: Backend verifica assinatura, expiração e autenticidade
5. **Acesso**: Se válido, requisição é processada; se não, retorna 401

### Propriedades JWT Garantidas:
- ✅ **Autenticidade**: Token assinado com `JWT_SECRET`
- ✅ **Integridade**: Qualquer alteração invalida o token
- ✅ **Confidencialidade**: Dados sensíveis não são expostos

---

## 🧪 Testando o Sistema

### 1. Cadastrar um Usuário
```bash
# Via frontend: Acesse /cadastro
# Ou via API:
curl -X POST http://localhost:5000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"usuario":"teste","senha":"123456"}'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"teste","senha":"123456"}'
```

### 3. Criptografar uma Mensagem
```bash
curl -X POST http://localhost:5000/api/cipher/criptografar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -d '{"mensagem":"hello123","passo":3}'
```

### 4. Descriptografar
```bash
curl -X POST http://localhost:5000/api/cipher/descriptografar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -d '{"mensagemCripto":"khoor456","hash":"<hash_recebido>"}'
```

---

## 📦 Scripts Disponíveis

### Backend (`cifra_cesar/`)
```powershell
npm start      # Iniciar servidor em produção
npm run dev    # Iniciar com hot-reload (Node 18+)
```

### Frontend (`cifra/`)
```powershell
npm run dev    # Servidor de desenvolvimento (Vite)
npm run build  # Build para produção
npm run preview # Preview do build
```

---

## 🎯 Fluxo de Uso Completo

1. **Cadastro**: Usuário cria conta → Senha hasheada no banco
2. **Login**: Credenciais validadas → JWT gerado e retornado
3. **Criptografar**:
   - Usuário envia mensagem e passo
   - Backend aplica Cifra de César
   - Gera hash único e salva no MongoDB (`usado = false`)
   - Retorna: mensagem criptografada + hash
4. **Descriptografar**:
   - Usuário envia mensagem criptografada + hash
   - Backend valida hash (existe? já usado?)
   - Se válido: descriptografa e marca `usado = true`
   - Retorna mensagem original
5. **Logout**: Token removido do localStorage

---

## ⚠️ Regras Importantes

1. ✅ Mensagens devem conter **apenas** `a-z`, `A-Z`, `0-9`
2. ✅ Passo pode ser **positivo ou negativo**
3. ✅ Hash pode ser usado **apenas uma vez**
4. ✅ Token JWT expira em **24 horas** (configurável)
5. ✅ Senhas nunca são armazenadas em texto plano

---

## 🐛 Troubleshooting

### MongoDB não conecta
```powershell
# Verificar se MongoDB está rodando
# Windows: Inicie o serviço MongoDB
# Ou use MongoDB Atlas (cloud) e atualize MONGODB_URI no .env
```

### CORS Error
```javascript
// Verifique se FRONTEND_URL está correto no backend
// cifra_cesar/server.js - linha cors({ origin: ... })
```

### Token inválido/expirado
```javascript
// Faça logout e login novamente
// Ou limpe o localStorage: localStorage.clear()
```

---

## 👨‍💻 Autor

Projeto desenvolvido para fins acadêmicos - **Segurança da Informação**

---

## 📄 Licença

MIT License - Livre para uso educacional e comercial.

---

## 🎉 Próximos Passos

- [ ] Adicionar testes automatizados (Jest/Vitest)
- [ ] Implementar refresh tokens
- [ ] Dashboard com estatísticas
- [ ] Exportar/importar chaves
- [ ] Suporte a mais algoritmos de criptografia

---

**Desenvolvido com ❤️ usando React, Node.js e MongoDB**
