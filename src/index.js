const express = require('express');
const cors = require('cors');
const dataBase = require('better-sqlite3');

//Create and config server
const app = express();
app.use(cors());
app.use(express.json());

//Init express application
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//api endpoints
app.get('/api/kittens/:user', (req, res) => {
  const user = req.params.user; //user is a string established in js variables
});
