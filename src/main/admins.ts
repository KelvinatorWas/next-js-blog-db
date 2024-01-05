import express from 'express'
import { Connection, OkPacket, RowDataPacket } from 'mysql2';

export const checkIfValidAdmin = (app: express.Express, connection: Connection) => {
  app.post(`/admins`, async (req, res) => {
    const { username, password } = req.body;

    connection.query(
      `SELECT * FROM admins WHERE username = ? AND password = ?`,
      [username, password],
      (error, results:RowDataPacket[]) => {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error', msg: error });
          return;
        }

        if (results.length === 0) {
          res.status(404).json({ error: 'Admin not found' });
        } else {
          const {username} = results[0]
          res.json({ username:username })
        }
      }
    );
  });
};