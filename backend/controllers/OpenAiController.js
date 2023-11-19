const axios = require("axios");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
          "Content-Type": "application/json",
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

module.exports = { processOpenAICall };
