const Chatbot = require("../models/Chatbot");
const {
  processOpenAICall,
  processOpenAICallConversation,
} = require("./openAiService");

const createChatbot = async (name, version, file, instructions) => {
  //console.log("FormData from frontend:", req.body);
  //console.log("File from frontend:", req.file);

  if (!file) {
    throw new Error("Nenhum arquivo enviado");
  }

  const fileBuffer = file.buffer;
  if (!fileBuffer) {
    throw new Error("Erro ao ler o arquivo txt");
  }

  const fileContent = fileBuffer.toString("utf-8");

  if (!instructions) {
    throw new Error("Instruções não fornecidas");
  }

  const openaiResponse = await processOpenAICall(fileContent, instructions);

  if (!openaiResponse) {
    throw new Error("Resposta da OpenAI não encontrada");
  }

  console.log("A resposta da OpenAi sobre a criação do bot e os seus dados: ", openaiResponse);
  
  const chatbotData = new Chatbot({
    name,
    version,
    instructions,
    fileContent,
    //openaiResponse,
  });

  try {
    await chatbotData.save();
  } catch (error) {
    console.error("Erro ao salvar no MongoDB:", error);
    throw new Error("Erro interno ao salvar no MongoDB");
  }
};

const sendMessage = async (chatbotName, message) => {
  const chatbot = await Chatbot.findOne({ name: chatbotName });

  if (!chatbot) {
    throw new Error("Chatbot não encontrado");
  }

  const openaiResponse = await processOpenAICallConversation(
    message,
    chatbot.fileContent,
    chatbot.instructions
  );
  if (!openaiResponse) {
    throw new Error("Resposta da OpenAI não encontrada");
  }

  return openaiResponse;
};

const getChatbots = async () => {
  return await Chatbot.find();
};

const getSegments = async () => {
  const chatbots = await Chatbot.find();

  if (chatbots.length === 0) {
    throw new Error("Nenhum segmento encontrado");
  }

  return chatbots.map((chatbot) => chatbot.openaiResponse).flat();
};

const getAvailableBots = async () => {
  return await Chatbot.find({}, "name version");
};

const getBotInformation = async (botName) => {
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
};

const findChatbotByName = async (name) => {
  return await Chatbot.findOne({ name });
};

module.exports = {
  createChatbot,
  sendMessage,
  getChatbots,
  getSegments,
  getAvailableBots,
  getBotInformation,
  findChatbotByName,
};
