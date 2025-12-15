import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import githubRoutes from './routes/githubRoutes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
}));

app.use(express.json()); 

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/github', githubRoutes);

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath, {
  index: 'index.html',
  maxAge: '1d',
  etag: false,
}));


app.use((_req, res) => {
  res.status(404).sendFile(path.join(distPath, '404.html'));
});

app.listen(PORT, () => {
  console.log(`?? Server is running on http://localhost:${PORT}`);
});
