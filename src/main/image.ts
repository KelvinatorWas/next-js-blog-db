import express from 'express';
import { connection } from '../db';

export const getImage = (app:express.Express) => {
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
};
