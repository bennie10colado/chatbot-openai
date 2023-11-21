const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openai');
const apiRoutes = require('./routes/api');
const { connectToDatabase } = require('./config/database'); 

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000' || 'http://localhost:5000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

connectToDatabase();

app.use('/', apiRoutes);
app.use('/openai', openaiRoutes);

const server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
