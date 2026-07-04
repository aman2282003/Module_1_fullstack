const express = require('express');
const { port } = require('./config');
const articlesRouter = require('./routes/articles');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/articles', articlesRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`articles-api listening on http://localhost:${port}`);
});

module.exports = app;
