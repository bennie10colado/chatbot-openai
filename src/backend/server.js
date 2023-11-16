const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://admin:chatbot123@cluster0.3nezhku.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.post("/api/openai", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao chamar a API do OpenAI" });
  }
});

app.get("/", (req, res) => {
  res.send("Seja bem-vindo à API do Chatbot!");
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
