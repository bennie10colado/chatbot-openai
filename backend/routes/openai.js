const express = require("express");
const multer = require("multer");
const {
  sendMessage,
  createChatbot,
} = require("../controllers/ChatbotController.js");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", (req, res) => {
  res.json({ message: "OpenAI route is working" });
});

router.post("/send-message", sendMessage);
router.post("/openai", upload.single("file"), createChatbot);

module.exports = router;
