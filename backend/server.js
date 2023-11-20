const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const openaiRoutes = require("./routes/openai");
const apiRoutes = require("./routes/api");
require("dotenv").config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: "http://localhost:3000" || "http://localhost:5000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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

const server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
