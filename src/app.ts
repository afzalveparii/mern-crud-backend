import dotenv from 'dotenv';
import { Express } from 'express';
import cors from 'cors';
import path from 'path';

dotenv.config();

import './db/conn';
import router from './Routes/router';
import express from 'express';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '6010', 10);

app.use(cors({
  origin: ["http://localhost:3000", "https://mern-crud-app-by-afzal.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/files", express.static(path.join(__dirname, "public", "files")));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});