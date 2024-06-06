const express = require('express');
const searchRoute = require('./routes/search');
const app = express();
const port = 5000;

app.use('/search', searchRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});