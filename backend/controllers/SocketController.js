const { processOpenAICall } = require("./ChatbotController");

const USER_ROLE = "user";
const BOT_ROLE = "bot";

const handleWebSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado via WebSocket");

    socket.on("message", async (message) => {
      try {
        console.log("Mensagem recebida:", message);

        const openaiResponse = await processOpenAICall(message.content, "");

        socket.emit("message", { content: openaiResponse, role: BOT_ROLE });
      } catch (error) {
        console.error("Erro ao processar a mensagem:", error.message);
        socket.emit("message", { content: "Desculpe, ocorreu um erro ao processar sua mensagem.", role: BOT_ROLE });
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado via WebSocket");
    });
  });
};

module.exports = {
  handleWebSocketConnection,
};
