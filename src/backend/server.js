const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const expressWS = require("express-ws");
const WebSocket = require("ws");
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Restante do código
const URI = process.env.MONGODB_URI;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
expressWS(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB Schema and Model
const chatbotSchema = new mongoose.Schema(
  {
    name: String,
    version: String,
    instructions: String,
    openaiResponse: String,
    fileContent: String,
  },
  { collection: "chatbot-collection" }
);

const ChatbotModel = mongoose.model("Chatbot", chatbotSchema);

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// WebSocket Configuration
app.ws("/ws", (ws, req) => {
  console.log("Nova conexão WebSocket");

  ws.on("message", (message) => {
    console.log("Mensagem recebida:", message);

    ws.send("Resposta do WebSocket!!!!");
  });
});

// OpenAI API Endpoint
app.post("/api/openai", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const fileContent = req.file.buffer.toString();

    if (!req.body.instructions) {
      return res.status(400).json({ error: "Instruções não fornecidas" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: fileContent },
          { role: "user", content: req.body.instructions },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const openaiResponse = response.data.choices[0].message.content;
    const { name, version } = req.body;

    const chatbotData = new ChatbotModel({
      name,
      version,
      instructions: req.body.instructions,
      openaiResponse,
      fileContent,
    });

    console.log("Antes de inserir no MongoDB");

    try {
      const result = await chatbotData.save();
      console.log("Depois de inserir no MongoDB:", result);
    } catch (error) {
      console.error("Erro ao salvar no MongoDB:", error);
    }

    app.getWss().clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(openaiResponse);
      }
    });

    res.json({ openaiResponse });
  } catch (error) {
    console.error("Erro ao chamar a API do OpenAI:", error);
    res.status(500).json({ error: "Erro interno ao chamar a API do OpenAI" });
  }
});

// CORS Configuration
app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes
app.get("/api/openai", (req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.get("/", (req, res) => {
  res.send("Seja bem-vindo à API do Chatbot!");
});

app.get("/get-chatbots", async (req, res) => {
  try {
    const chatbots = await ChatbotModel.find();
    res.json({ chatbots });
  } catch (error) {
    console.error("Erro ao buscar chatbots no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar chatbots" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
