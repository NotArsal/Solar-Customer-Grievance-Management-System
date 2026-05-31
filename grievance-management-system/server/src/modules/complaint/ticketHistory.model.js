import mongoose from 'mongoose';

const ticketHistorySchema = new mongoose.Schema({
  ticket_id: { type: String, required: true },
  action: { type: String, enum: ["status_change", "comment", "assignment", "escalation"], required: true },
  from_status: { type: String },
  to_status: { type: String },
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
  is_public: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

export default mongoose.model('TicketHistory', ticketHistorySchema);
