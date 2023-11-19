const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const openaiRoutes = require("./routes/openai");
const apiRoutes = require("./routes/api");
const socket = require("socket.io");
require("dotenv").config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", apiRoutes);
app.use("/openai", openaiRoutes);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
