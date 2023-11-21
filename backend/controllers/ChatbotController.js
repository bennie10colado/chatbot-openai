const chatbotService = require("../services/chatbotService");
const multerMiddleware = require("../middlewares/multerMiddlewares");

const createChatbot = async (req, res) => {
  try {
    const file = req.file;
    const { name, version, instructions } = req.body;

    await chatbotService.createChatbot(name, version, file, instructions);

    res.json({ message: "Welcome to the OpenAI server!" });
  } catch (error) {
    console.error("Erro inesperado ao criar chatbot:", error.message);
    res.status(500).json({ error: "Erro inesperado ao criar chatbot" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, chatbotName } = req.body;

    const openaiResponse = await chatbotService.sendMessage(
      chatbotName,
      message
    );

    res.json({ openaiResponse });
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
};

const getChatbots = async (req, res) => {
  try {
    const chatbots = await chatbotService.getChatbots();
    res.json({ chatbots });
  } catch (error) {
    console.error("Erro ao buscar chatbots no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar chatbots" });
  }
};

const getSegments = async (req, res) => {
  try {
    const segments = await chatbotService.getSegments();
    res.json({ segments });
  } catch (error) {
    console.error("Erro ao buscar segmentos no MongoDB:", error);
    res.status(500).json({ error: "Erro interno ao buscar segmentos" });
  }
};

const getAvailableBots = async (req, res) => {
  try {
    const availableBots = await chatbotService.getAvailableBots();
    res.json(availableBots);
  } catch (error) {
    console.error("Erro ao obter a lista de bots disponíveis:", error);
    res
      .status(500)
      .json({ error: "Erro ao obter a lista de bots disponíveis" });
  }
};

module.exports = {
  createChatbot,
  sendMessage,
  getChatbots,
  getSegments,
  getAvailableBots,
};
