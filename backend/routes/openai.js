const express = require("express");
const router = express.Router();
const {
  sendMessage,
  createChatbot,
} = require("../controllers/ChatbotController.js");

router.post("/", (req, res) => {
  res.json({ message: "OpenAI route is working" });
});

router.post("/send-message", sendMessage);
router.post("/create-chatbot", createChatbot);

module.exports = router;
