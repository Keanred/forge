import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { isHttpError } from './errors/http';
import itemsRouter from './routes/items';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', itemsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  if (isHttpError(err)) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

export default app;
