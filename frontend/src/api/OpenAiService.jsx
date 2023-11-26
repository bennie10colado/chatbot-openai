import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const createChatbot = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/openai/openai`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200 || 201) {
      console.log('Chatbot criado com sucesso!');
      return response.data;
    } else {
      console.error('Erro ao criar o chatbot');
      throw new Error('Erro ao criar o chatbot');
    }
  } catch (error) {
    console.error('Erro ao enviar a solicitação para o backend', error);
    throw new Error('Erro ao enviar a solicitação para o backend');
  }
};

const sendMessage = async (message, chatbotName) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/openai/send-message`,
      { message, chatbotName }
    );

    return response.data.openaiResponse;
  } catch (error) {
    console.error('Erro ao enviar mensagem para a API da OpenAI:', error);
    throw new Error('Erro ao enviar mensagem para a API da OpenAI');
  }
};

const getAvailableBots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-available-bots`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter a lista de bots disponíveis:', error);
    throw new Error('Erro ao obter a lista de bots disponíveis');
  }
};

const openaiService = {
  createChatbot,
  sendMessage,
  getAvailableBots,
};

export default openaiService;
