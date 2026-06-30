import { processEmailQueue } from '../services/email.service.js';

export const initEmailRetryJob = () => {
  // Run immediately on startup (optional, but good if we just booted)
  processEmailQueue();

  // Run every 10 minutes
  setInterval(processEmailQueue, 10 * 60 * 1000);
};
