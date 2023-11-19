const express = require("express");
const router = express.Router();
const Chatbot = require("../models/Chatbot");
const { getSegments, getChatbots } = require("../controllers/ChatbotController");


router.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

router.get("/get-segments", getSegments);
router.get("/get-chatbots", getChatbots);


module.exports = router;
