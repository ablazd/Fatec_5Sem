const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Criar um objeto Express e configurar Porta
const app = express();
const port = 3000;

// Vincular o middleware ao Express
app.use(cors());

// Permissâo para usar outros métodos HTTP
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

//Permissâo servidor
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Conectar ao banco de dados
let url = "mongodb://localhost:27017/FatecVotorantim";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados", err);
  });

// Definir um modelo de exemplo
const User = mongoose.model("User", { name: String });

// Inserir dados de exemplo
app.post("/users", async (req, res) => {
  let newUser = new User({ name: req.body.name });
  await newUser.save().then(() => {
    console.log("status: Usuário criado com sucesso!");
    res.status(201).send({ message: "Usuário criado com sucesso!" });
  }).catch((err) => {
    console.log("status: Erro ao criar usuário");
    res.status(500).send({ message: "Erro ao criar usuário", error: err });
  });
});

//deletar dados a partir do nome
app.delete("/users/name/", async (req, res) => {
  await User.deleteOne({ name: req.body.name }).then(() => {
    console.log("status: Usuário deletado com sucesso!");
    res.status(200).send({ message: "Usuário deletado com sucesso!" });
  }).catch((err) => {
    console.log("status: Erro ao deletar usuário");
    res.status(500).send({ message: "Erro ao deletar usuário", error: err });
  });
});

// Deletar dados de exemplo
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id).then(() => {
    console.log("status: Usuário deletado com sucesso!");
    res.status(200).send({ message: "Usuário deletado com sucesso!" });
  }).catch((err) => {
    console.log("status: Erro ao deletar usuário");
    res.status(500).send({ message: "Erro ao deletar usuário", error: err });
  });
});

// Alterar dados de exemplo pelo nome
app.put("/users/name/", async (req, res) => {
  await User.findOneAndUpdate({ name: req.body.name }, { name: req.body.newName }).then(() => {
    console.log("status: Usuário alterado com sucesso!");
    res.status(200).send({ message: "Usuário alterado com sucesso!" });
  }).catch((err) => {
    console.log("status: Erro ao alterar usuário");
    res.status(500).send({ message: "Erro ao alterar usuário", error: err });
  });
});

// Alterar dados de exemplo pelo ID
app.put("/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { name: req.body.name }).then(() => {
    console.log("status: Usuário alterado com sucesso!");
    res.status(200).send({ message: "Usuário alterado com sucesso!" });
  }).catch((err) => {
    console.log("status: Erro ao alterar usuário");
    res.status(500).send({ message: "Erro ao alterar usuário", error: err });
  });
});

// Rota padrão
app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

// Get by name
app.get("/users/name/:name", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) return res.status(404).send({ message: "Usuário não encontrado" });
    res.status(200).send(user);
  } catch (err) {
    console.error("Erro ao buscar usuário", err);
    res.status(500).send({ message: "Erro ao buscar usuário", error: err });
  }
});

// Get By ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "Usuário não encontrado" });
    res.status(200).send(user);
  } catch (err) {
    console.error("Erro ao buscar usuário", err);
    res.status(500).send({ message: "Erro ao buscar usuário", error: err });
  }
});

// Get All
app.get("/users", async (req, res) => {
  await User.find().then((users) => {
    res.status(200).send(users);
  }).catch((err) => {
    console.log("status: Erro ao buscar usuários");
    res.status(500).send({ message: "Erro ao buscar usuários", error: err });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
