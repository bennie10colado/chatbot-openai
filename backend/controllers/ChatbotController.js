const multer = require("multer");
const Chatbot = require("../models/Chatbot");
const { processOpenAICall } = require("./OpenAiController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); //passivel de remocao

const createChatbot = async (req, res) => {
  try {
    //console.log("FormData from frontend:", req.body);
    //console.log("File from frontend:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const fileBuffer = req.file.buffer;
    if (!fileBuffer) {
      return res.status(400).json({ error: "Erro ao ler o arquivo txt" });
    }

    const fileContent = fileBuffer.toString("utf-8");

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

    try {
      const result = await chatbotData.save();
      console.log("Depois de inserir no MongoDB:", result);
      res.json({ message: "Welcome to the OpenAI server!", openaiResponse });
    } catch (error) {
      console.error("Erro ao salvar no MongoDB:", error);
      res.status(500).json({ error: "Erro interno ao salvar no MongoDB" });
    }
  } catch (error) {
    console.error("Erro inesperado ao criar chatbot:", error.message);
    res.status(500).json({ error: "Erro inesperado ao criar chatbot" });
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

    res.json({ openaiResponse });
  } catch (error) {
    console.error("Erro inesperado:", error);
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

async function getBotInformation(botName) {
  try {
    const bot = await Chatbot.findOne({ name: botName });
    if (!bot) {
      throw new Error(`Bot com o nome ${botName} não encontrado.`);
    }

    const instructions = bot.instructions;
    const fileContent = bot.fileContent;

    return { instructions, fileContent };
  } catch (error) {
    console.error("Erro ao obter informações do bot:", error);
    throw error;
  }
}

const getAvailableBots = async (req, res) => {
  try {
    const availableBots = await Chatbot.find({}, 'name version');
    res.json(availableBots);
  } catch (error) {
    console.error('Erro ao obter a lista de bots disponíveis:', error);
    res.status(500).json({ error: 'Erro ao obter a lista de bots disponíveis' });
  }
};

module.exports = {
  createChatbot,
  sendMessage,
  getChatbots,
  getSegments,
  getBotInformation,
  getAvailableBots,
};
