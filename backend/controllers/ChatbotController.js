const Chatbot = require("../models/Chatbot");
const { processOpenAICall } = require("./OpenAiController");

const createChatbot = async (req, res) => {
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

    res.send("Welcome to the OpenAI server!");

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
};

const sendMessage = async (req, res) => {
  try {
    const { message, chatbotName } = req.body;

    if (!message || !chatbotName) {
      return res.status(400).json({
        error: "Mensagem do usuário ou nome do chatbot não fornecido",
      });
    }

    const chatbot = await Chatbot.findOne({ name: chatbotName });

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

    //dealing with answers messages
    io.emit("message", { content: openaiResponse, role: "bot" });

    res.json({ openaiResponse });
  } catch (error) {
    console.error("Erro inesperado:", error.message);
    res.status(500).json({ error: "Erro inesperado" });
  }
};

const getChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find();
    res.json({ chatbots });
  } catch (error) {
    console.error("Erro ao buscar chatbots no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar chatbots" });
  }
};

const getSegments = async (req, res) => {
  try {
    const chatbots = await Chatbot.find();

    if (chatbots.length === 0) {
      return res.status(404).json({ error: "Nenhum segmento encontrado" });
    }

    const segments = chatbots.map((chatbot) => chatbot.openaiResponse).flat();

    res.json({ segments });
  } catch (error) {
    console.error("Erro ao buscar segmentos no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar segmentos" });
  }
};

module.exports = {
  createChatbot,
  sendMessage,
  getChatbots,
  getSegments,
};
