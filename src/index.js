const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

//Create and config server
const app = express();
app.use(cors());
app.use(express.json());

//Init express application
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//Config database
const db = new Database('./src/db/database.db', { verbose: console.log });

//api endpoints

//get user kittens
app.get('/api/kittens/:user', (req, res) => {
  const user = req.params.user; //user is a string established in js variables

  const query = db.prepare('SELECT * FROM kittens WHERE owner = ?');
  const userKittens = query.all(user); //get kittens array back

  if (userKittens) {
    res.json({
      success: true,
      info: {
        count: userKittens.length,
      },
      results: userKittens,
    });
  } else {
    res.json({ success: false, message: 'This user has no kittens yet' });
  }
});

app.post('/api/kittens/:user', (req, res) => {
  const user = req.params.user; //user is a string established in js variables
  const newKittenData = req.body;

  const query = db.prepare(
    'INSERT INTO kittens (owner, url, name, race, desc) VALUES (?, ?, ?, ?, ?)'
  );
  const newKittenResult = query.run(
    user,
    newKittenData.image,
    newKittenData.name,
    newKittenData.race,
    newKittenData.desc
  );

  if (newKittenResult.changes === 1) {
    res.json({ success: true, message: 'New kitten added to the family!' });
  } else {
    res.json({
      success: false,
      message: 'The new kitten has been lost! Try again!',
    });
  }
});

app.patch('/api/kittens/:user/:kittenId', (req, res) => {
  const user = req.params.user;
  const kittenToUpdate = req.params.kittenId;

  const query = db.prepare('UPDATE kittens SET ?? WHERE owner = ? AND id = ?');
  const result = query.run(user, kittenToUpdate);

  if (result.changes === 1) {
    res.json({ success: true, message: 'Kitten updated!' });
  } else {
    res.json({
      success: false,
      message: `Kitten can't be updated!`,
    });
  }
});

app.delete('/api/kittens/:user/:kittenId', (req, res) => {
  const user = req.params.user;
  const kittenToDelete = req.params.kittenId;

  const query = db.prepare('DELETE FROM ittens WHERE owner = ? AND id = ?');
  const result = query.run(user, kittenToDelete);

  if (result.changes === 1) {
    res.json({ success: true, message: 'Kitten eliminated!' });
  } else {
    res.json({
      success: false,
      message: `Kitten can't be eliminated! Try again!`,
    });
  }
});

//Static servers
const staticServerPathWeb = 'src/public-web';
app.use(express.static(staticServerPathWeb));
