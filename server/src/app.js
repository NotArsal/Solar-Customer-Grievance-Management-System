import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './core/middleware/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import complaintRoutes from './modules/complaint/complaint.routes.js';
import telegramRoutes from './services/telegram.routes.js';
import mediaRoutes from './core/utils/media.routes.js';
import categoryRoutes from './modules/routing/category.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import reportRoutes from './modules/report/report.routes.js';

const app = express();

app.use(helmet());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CLIENT_URL || 'https://industryproject-frontend.vercel.app')
    : (process.env.CLIENT_URL || 'http://localhost:5173')
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CGMS API is running' });
});

app.use('/v1/auth', authRoutes);
app.use('/v1/complaints', complaintRoutes);
app.use('/v1/telegram', telegramRoutes);
app.use('/v1/media', mediaRoutes);
app.use('/v1/routing-categories', categoryRoutes);
app.use('/v1/notifications', notificationRoutes);
app.use('/v1/reports', reportRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use(errorHandler);

export default app;
