const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  segments: [
    {
      type: String,
    },
  ],
});

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
