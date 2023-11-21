const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openai');
const routes = require('./routes/routes');
const { connectToDatabase } = require('./config/database'); 
const middlewares = require('./middlewares/middlewares'); 

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

app.use('/', routes);
app.use('/openai', openaiRoutes);

app.use(middlewares.errorHandlerMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
