const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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
    fileContent: {
      type: String,
    },
    //openaiResponse: {
    //  type: String,
    //},
  },
  { collection: "chatbots-collection" }
);

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
