import { processEmailQueue } from '../services/email.service.js';

export const initEmailRetryJob = () => {
  // Run immediately on startup (optional, but good if we just booted)
  processEmailQueue();

  // Run every 1 minute
  setInterval(processEmailQueue, 60 * 1000);
};
