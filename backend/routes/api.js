const express = require("express");
const axios = require("axios");
const router = express.Router();
const Chatbot = require("../models/Chatbot");

router.post("/create-chatbot", async (req, res) => {
  const { name, instructions, fileSegments } = req.body;

  try {
    const newChatbot = new Chatbot({
      name,
      instructions,
      segments: fileSegments,
    });

    const savedChatbot = await newChatbot.save();

    res.json({ chatbot: savedChatbot });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o chatbot" });
  }
});

router.get("/get-chatbots", async (req, res) => {
  try {
    const chatbots = await Chatbot.find();

    res.json({ chatbots });
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter os chatbots" });
  }
});

module.exports = router;
