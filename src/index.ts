import express, { Application, Request, Response } from 'express';
import imageRoutes from './routes/imageRoutes';

const app: Application = express();
const port: number = 3000;

app.use('/api/images', imageRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Image Resizer API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
