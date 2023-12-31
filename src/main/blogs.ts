import express from 'express';
import { Connection, OkPacket, RowDataPacket } from 'mysql2';

export const getBlogs = (app:express.Express, connection:Connection) => {
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
}

export const getBlogByName = (app:express.Express, connection:Connection) => {
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
}

export const createNewBlog = (app:express.Express, connection:Connection) => {
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
}
