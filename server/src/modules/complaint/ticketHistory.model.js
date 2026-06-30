import mongoose from 'mongoose';

const ticketHistorySchema = new mongoose.Schema({
  ticket_id: { type: String, required: true },
  action: { type: String, enum: ["status_change", "comment", "assignment", "escalation", "priority_change", "note"], required: true },
  from_status: { type: String },
  to_status: { type: String },
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
  is_public: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });
ticketHistorySchema.index({ ticket_id: 1, is_public: 1 });
ticketHistorySchema.index({ timestamp: -1 });
ticketHistorySchema.index({ ticket_id: 1, timestamp: -1 });

export default mongoose.model('TicketHistory', ticketHistorySchema);
