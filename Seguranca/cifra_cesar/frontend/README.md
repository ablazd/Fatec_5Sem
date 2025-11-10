# 🎨 Frontend - Cifra de César

Frontend da aplicação de Cifra de César com React + Vite.

## 🚀 Inicialização Rápida

```powershell
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## 📦 Dependências

- **React 18**: Biblioteca UI
- **Vite**: Build tool rápido
- **CSS Moderno**: Estilização com variáveis CSS

## 🔧 Configuração (Opcional)

Crie um arquivo `.env` se precisar configurar a URL da API:

```env
VITE_API_URL=http://localhost:5000/api
```

Por padrão, usa `http://localhost:5000/api`.

## 📂 Estrutura

```
cifra/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Cadastro.jsx
│   │   ├── Criptografar.jsx
│   │   └── Descriptografar.jsx
│   ├── services/
│   │   └── api.js         # Serviço de comunicação com API
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── styles.css         # Estilos globais
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design

- **Minimalista**: Interface limpa e fácil de usar
- **Paleta de cores**: Tons de vermelho forte + neutros
- **Responsivo**: Adaptável para mobile e desktop

## � Scripts

```powershell
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 🔐 Autenticação

O frontend armazena o token JWT no `localStorage` e o envia automaticamente em todas as requisições protegidas.

## 📱 Telas

1. **Login**: Autenticação de usuários
2. **Cadastro**: Registro de novos usuários
3. **Criptografar**: Criptografia com Cifra de César
4. **Descriptografar**: Descriptografia com hash único
