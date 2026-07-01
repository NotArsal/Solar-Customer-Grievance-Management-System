import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import app from './app.js';
import { connectDB } from './config/db.js';
import { initJobs } from './jobs/sla.checker.js';
import { initEmailRetryJob } from './jobs/email.retry.job.js';
import { logger } from './core/utils/logger.js';

import { seedEmployees } from './core/seedEmployees.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedEmployees();
  initJobs();
  initEmailRetryJob();
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Database connection failed', { error: err.message, stack: err.stack });
});