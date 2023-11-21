const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
};

module.exports = {
  loggerMiddleware,
  errorHandlerMiddleware,
};
