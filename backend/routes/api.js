const express = require("express");
const router = express.Router();
const {
  getSegments,
  getChatbots,
  getAvailableBots,
} = require("../controllers/chatbotController");

router.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

router.get("/get-segments", getSegments);
router.get("/get-chatbots", getChatbots);
router.get("/get-available-bots", getAvailableBots);

module.exports = router;
