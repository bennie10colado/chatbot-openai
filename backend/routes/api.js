const express = require("express");
const router = express.Router();
const {
  getSegments,
  getChatbots,
  getAvailableBots,
  getBotInformation,
} = require("../controllers/ChatbotController");

router.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

router.get("/get-segments", getSegments);
router.get("/get-chatbots", getChatbots);
router.get("/get-available-bots", getAvailableBots);
router.get("/get-information-bots", getBotInformation);

module.exports = router;
