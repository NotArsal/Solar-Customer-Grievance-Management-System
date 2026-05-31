import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticket_id: { type: String },
  message: { type: String, required: true },
  type: { type: String, enum: ['SLA_BREACH', 'NEW_TICKET', 'STATUS_UPDATE', 'ASSIGNMENT', 'GENERAL'], required: true },
  is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.model('Notification', notificationSchema);
