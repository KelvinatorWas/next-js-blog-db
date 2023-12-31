import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import { DataBase } from './main/main';

export type DB = {
  app: express.Express;
  port:number;
};

const Listener = ({app, port}: DB) => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  }); 
};

const InitApp = ({app}:DB) => {
  app.use(bodyParser.json());

  app.use(cors({
    origin: '*'
  }));
  
  app.get('/', async (req, res) => {
    res.json({message: "Hello form server"});
  });
};

const initDataBase = () => {
  const initDB: DB = {
    app: express(),
    port: 3001,
  }

  // Init App
  InitApp(initDB);

  // call main data base
  DataBase(initDB);

  // Server Listener
  Listener(initDB);
};

initDataBase();
