import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'failed', 'sent'],
    default: 'pending',
  },
  retry_count: {
    type: Number,
    default: 0,
  },
  last_error: {
    type: String,
  },
  ticket_id: {
    type: String,
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const EmailQueue = mongoose.model('EmailQueue', emailQueueSchema);

export default EmailQueue;
