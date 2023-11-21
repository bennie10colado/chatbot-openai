import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//const API_REQUEST_URL = process.env.REACT_APP_API_REQUEST_URL;

const createChatbot = async (formData) => {
  try {
    const response = await axios.post(
        "http://localhost:5000/openai/openai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    if (response.status === 200) {
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

//const sendMessage = async (message, chatbotName) => {};

const openaiService = {
  createChatbot,
  //sendMessage,
};

export default openaiService;
