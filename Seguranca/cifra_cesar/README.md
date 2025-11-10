# 🔐 Cifra de César - Sistema Completo com JWT e MongoDB

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

