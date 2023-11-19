const express = require("express");
const WebSocket = require("ws");
const socketIO = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const Chatbot = require("./models/Chatbot");

const URI = process.env.MONGODB_URI;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// WebSocket Configuration
io.on("connection", (socket) => {
  console.log("Novo usuário conectado via WebSocket");

  socket.on("message", async (message) => {
    console.log("Mensagem recebida:", message);

    const openaiResponse = await processOpenAICall(message.content, "");
    socket.emit("message", { content: openaiResponse, role: "bot" });
  });
});

// Processing call to the endpoint of openai
const processOpenAICall = async (fileContent, instructions) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: fileContent },
          { role: "user", content: instructions },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0]?.message?.content;
  } catch (error) {
    console.error("Erro ao chamar a API do OpenAI:", error);
    throw new Error("Erro interno ao chamar a API do OpenAI");
  }
};

// API
app.post("/api/openai", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const fileContent = req.file.buffer.toString();

    if (!req.body.instructions) {
      return res.status(400).json({ error: "Instruções não fornecidas" });
    }

    const openaiResponse = await processOpenAICall(
      fileContent,
      req.body.instructions
    );

    if (!openaiResponse) {
      return res
        .status(500)
        .json({ error: "Resposta da OpenAI não encontrada" });
    }

    const { name, version } = req.body;

    const chatbotData = new Chatbot({
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
      res.json({ openaiResponse });
    } catch (error) {
      console.error("Erro ao salvar no MongoDB:", error);
      res.status(500).json({ error: "Erro interno ao salvar no MongoDB" });
    }
  } catch (error) {
    console.error("Erro inesperado:", error.message);
    res.status(500).json({ error: "Erro inesperado" });
  }
});

// deal with messages from user
app.post("/api/send-message", async (req, res) => {
  try {
    const { message, chatbotName } = req.body;

    if (!message || !chatbotName) {
      return res.status(400).json({
        error: "Mensagem do usuário ou nome do chatbot não fornecido",
      });
    }

    const chatbot = await ChatbotModel.findOne({ name: chatbotName });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot não encontrado" });
    }

    const openaiResponse = await processOpenAICall(
      message,
      chatbot.instructions
    );

    if (!openaiResponse) {
      return res
        .status(500)
        .json({ error: "Resposta da OpenAI não encontrada" });
    }

    io.emit("message", { content: openaiResponse, role: "bot" });

    res.json({ openaiResponse });
  } catch (error) {
    console.error("Erro inesperado:", error.message);
    res.status(500).json({ error: "Erro inesperado" });
  }
});

//Middleware to deal with CORS headres errors
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

// Middleware to deal with global errors
app.use((err, req, res, next) => {
  console.error("Erro global:", err);
  res.status(500).json({ error: "Erro interno" });
});

// Routes
app.get("/", (req, res) => {
  res.send("Seja bem-vindo à API do Chatbot!");
});

app.get("/api/openai", (req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.get("/get-chatbots", async (req, res) => {
  try {
    const chatbots = await Chatbot.find();
    res.json({ chatbots });
  } catch (error) {
    console.error("Erro ao buscar chatbots no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar chatbots" });
  }
});

app.get("/api/get-segments", async (req, res) => {
  try {
    const chatbots = await Chatbot.find();

    if (chatbots.length === 0) {
      return res.status(404).json({ error: "Nenhum segmento encontrado" });
    }

    const responses = chatbots.map((chatbot) => chatbot.openaiResponse);

    const prettyJSON = JSON.stringify({ segments: responses }, null, 2);

    res.header("Content-Type", "application/json");
    res.status(200).send(prettyJSON);
  } catch (error) {
    console.error("Erro ao buscar segmentos no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar segmentos" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

app.get("/api/chatbots/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const chatbot = await Chatbot.findOne({ name });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot não encontrado" });
    }

    res.json({ chatbot });
  } catch (error) {
    console.error("Erro ao buscar chatbot no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar chatbot" });
  }
});
