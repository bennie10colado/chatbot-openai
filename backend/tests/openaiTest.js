const axios = require("axios");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const data = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Say this is a test!" }],
  temperature: 0.7,
};

axios
  .post("https://api.openai.com/v1/chat/completions", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Erro ao chamar a API do OpenAI:", error);
  });
