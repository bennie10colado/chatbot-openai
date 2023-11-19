const { processOpenAICall } = require("./ChatbotController");

const handleWebSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado via WebSocket");

    socket.on("message", async (message) => {
      console.log("Mensagem recebida:", message);

      const openaiResponse = await processOpenAICall(message.content, "");
      socket.emit("message", { content: openaiResponse, role: "bot" });
    });
  });
};

module.exports = {
  handleWebSocketConnection,
};
