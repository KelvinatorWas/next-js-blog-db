import express from 'express';
const cors = require('cors');
import { connection } from "./db";
import { OkPacket, RowDataPacket } from 'mysql2';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(cors({
  origin: '*'
}));

app.get('/', async (req, res) => {
  res.json({message: "Hello form server"});
});

app.get('/blogs', async (req, res) => {
  // Execute the query to get all users
  connection.query('SELECT * FROM blogs', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the users as a JSON response
    res.json(results);
  });
});

app.get('/blogs/:name', async (req, res) => {
  // Execute the query to get all users
  const { name } = req.params;

  const fixedName = name.replace('_', " ")

  connection.query('SELECT * FROM blogs WHERE title = ?', fixedName, (error, results:RowDataPacket[]) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the users as a JSON response
    res.json(results[0]);
  });
});

// Add to blogs
app.post(`/blogs`, async (req, res) => {
  console.log("Before")
  const { title, content, createdAt} = req.body;

  console.log(req.body)
  connection.query(`INSERT INTO blogs (title, content, createdAt) 
    VALUES ('${title}', '${content}', '${createdAt}')`, 
    (error, results:OkPacket) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error', msg:error });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(204).end();
    }
  });
});

// get image
app.get('/images/:name', async (req, res) => {
  const { name } = req.params;

  console.log(name)

  const selectImage = `
    SELECT image_data
    FROM images
    WHERE image_name = ?;
    `;

  connection.query(selectImage, name, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const isArray = Array.isArray(results);
    if (isArray) {
    const image = (results[0] as { image_data: Buffer }).image_data;
      // Send the users as a JSON response
      res.contentType('image/jpeg').send(image);
    }
    else res.status(404).json("ERROR NO IMAGE FOUND");
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
