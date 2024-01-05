import { Connection, OkPacket } from "mysql2";
import express from 'express'


export const createNewComment = (app:express.Express, connection:Connection) => {
  app.post(`/comments`, async (req, res) => {
    console.log("Before")
    const { comment_id, post_id, user_id, content, createdAt} = req.body;

    console.log(req.body)
    connection.query(`INSERT INTO comments (post_id, user_id, content, createdAt) 
      VALUES ('${post_id}', ${user_id}, '${content}', '${createdAt}')`, 
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
};

export const getAllPostComments = (app: express.Express, connection: Connection) => {
  app.get('/comments/:id', async (req, res) => {
    const id = req.params.id; // post id

    const query = 'SELECT * FROM comments WHERE post_id = ?';

    connection.query(query, id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', msg: error });
        return;
      }

      res.json(results);
    });
  });
};

export const getAllComments = (app: express.Express, connection: Connection) => {
  app.get('/comments', async (req, res) => {
    const query = 'SELECT comments.*, blogs.title AS post_name FROM comments JOIN blogs ON comments.post_id = blogs.post_id'

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', msg: error });
        return;
      }

      res.json(results);
    });
  });
};

export const deleteCommentById = (app:express.Express, connection:Connection) => {
  app.delete('/comments/:id', async (req, res) => {
    const id = req.params.id;
    // Execute the query to get all users
    connection.query('DELETE FROM comments WHERE comment_id=?', id, (error, results:OkPacket) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', msg: error});
        return;
      }
  
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.status(204).end();
      }
    });
  });
};