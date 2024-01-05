import { Connection, OkPacket } from "mysql2";
import express from 'express'

export const deletePostTags = (app:express.Express, connection:Connection) => {
  app.delete('/post_tags/:id', async (req, res) => {
    const id = req.params.id;
    
    connection.query('DELETE FROM post_tags WHERE post_id=?', id, (error, results:OkPacket) => {
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

type TagsData = {
  post_id: string;
  tag_id: number;
};


export const addPostsTag = (app:express.Express, connection:Connection) => {
  app.post('/post_tags', async (req, res) => {
    const data:TagsData[] = req.body;

    data.map(
      ({post_id:blogId, tag_id:tagId}) => {

        connection.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [blogId, tagId], (error, results:OkPacket) => {
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

      }
    );
  });
};

export const getBlogPostTag = (app:express.Express, connection:Connection) => {
  app.get('/post_tags/:id', async (req, res) => {
    const id = req.params.id; // id of the blog
    
    const query = 'SELECT * FROM post_tags JOIN tags ON post_tags.tag_id = tags.tag_id WHERE post_tags.post_id = ?';

    connection.query(query, id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', msg: error});
        return;
      }
  
      res.json(results);
    });
  });
}
