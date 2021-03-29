const express = require('express');
const db = require('./server/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('*', (req, res) => {
  res.sendFile('./public/index.html');
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

const PORT = process.env.PORT || 1337;
app.listen(PORT, () =>
  console.log(`studiously serving super survival strats on port ${PORT}`)
);
