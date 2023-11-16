const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(
  "mongodb+srv://admin:chatbot123@cluster0.3nezhku.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());

app.post("/api/openai", upload.single("file"), async (req, res) => {
  const { name, version, instructions } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        prompt: instructions,
        documents: req.file.buffer.toString(),
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao chamar a API do OpenAI" });
  }
});

app.get("/api/openai", (req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.get("/", (req, res) => {
  res.send("Seja bem-vindo à API do Chatbot!");
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
