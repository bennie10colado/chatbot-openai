const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const openaiRoutes = require("./routes/openai");
const apiRoutes = require("./routes/api");
const { handleWebSocketConnection } = require("./controllers/SocketController");
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

const server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: [],
  },
});

handleWebSocketConnection(io);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Successful");

    const db = mongoose.connection;
    const collection = db.collection("comments");
    const changeStream = collection.watch();

    changeStream.on("change", (change) => {
      console.log(change);
      io.emit("change", change);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
