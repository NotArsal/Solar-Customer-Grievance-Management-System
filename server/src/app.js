import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './core/middleware/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import complaintRoutes from './modules/complaint/complaint.routes.js';
import telegramRoutes from './services/telegram.routes.js';
import mediaRoutes from './core/utils/media.routes.js';

const app = express();

app.use(helmet());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : (process.env.CLIENT_URL || 'http://localhost:5173')
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CGMS API is running' });
});

app.use('/v1/auth', authRoutes);
app.use('/v1/complaints', complaintRoutes);
app.use('/v1/telegram', telegramRoutes);
app.use('/v1/media', mediaRoutes);

app.use(errorHandler);

export default app;
