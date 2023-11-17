const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/create-chatbot", chatbotController.createChatbot);
router.get("/get-chatbots", chatbotController.getChatbots);

module.exports = router;
