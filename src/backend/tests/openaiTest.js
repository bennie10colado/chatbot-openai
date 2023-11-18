const axios = require("axios");

const openaiApiKey = "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";

const data = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Say this is a test!" }],
  temperature: 0.7,
};

axios
  .post("https://api.openai.com/v1/chat/completions", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Erro ao chamar a API do OpenAI:", error);
  });
