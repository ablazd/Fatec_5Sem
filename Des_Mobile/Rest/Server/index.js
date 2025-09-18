// expressjs.com
//ttps://expressjs.com/en/resources/middleware/method-override.html

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const port = 3000;
// criar um objeto express
const app = express();
//vincualr o middleware ao express
app.use(cors());

// permissão para usar outros métodos HTTP
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

//permissão servidor
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

//  fazer a conexão com o banco de dados mongoose
 let  url = "mongodb://localhost:27017/FatecVotorantim";

 // testa a conexão
 mongoose.connect(url)
 .then(
     () => console.log('MongoDB connected...') )
 .catch(
   () => { console.log("erro na conexão: " ) }
  );

// Estrutura do modelo Aluno
const alunoSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  nome: {
    type: String,
    required: true
  },
  endereco: {
    cep: {
      type: String,
      required: true
    },
    logradouro: String,
    cidade: String,
    bairro: String,
    estado: String,
    numero: String,
    complemento: String
  },
  cursos: [{
    type: String
  }]
}, {
  timestamps: true
});

const Aluno = mongoose.model('Aluno', alunoSchema);

// Rota para buscar CEP na API ViaCEP
app.get('/api/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    
    // Validar formato do CEP
    if (!/^\d{8}$/.test(cep)) {
      return res.status(400).json({ error: 'CEP deve conter apenas 8 dígitos' });
    }
    
    console.log(`Buscando CEP: ${cep}`);
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (response.data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    
    console.log(`CEP encontrado: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar CEP:', error.message);
    res.status(500).json({ error: 'Erro ao buscar CEP: ' + error.message });
  }
});

// Rota principal - serve a página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Routes para Alunos

// Listar todos os alunos
app.get('/api/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find({});
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Buscar aluno por ID
app.get('/api/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// Criar novo aluno
app.post('/api/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json({ message: 'Aluno criado com sucesso', aluno });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Matrícula já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao criar aluno' });
    }
  }
});

// Atualizar aluno
app.put('/api/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json({ message: 'Aluno atualizado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// Deletar aluno
app.delete('/api/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port http://localhost:${port}`)
  console.log(`Server accessible from network at http://192.168.50.81:${port}`)
})
