import express from 'express'
import { Connection } from 'mysql2';

export const getAllTags = (app:express.Express, connection:Connection) => {
  app.get('/tags', async (req, res) => {
    
    const query = 'SELECT * FROM tags';

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', msg: error});
        return;
      }
  
      res.json(results);
    });
  });
}