import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String, required: true },
  invoice_no: { type: String },
  product_type: { type: String, enum: ["Solar Panel", "Inverter", "Battery", "Service", "Other"], required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  attachments: [{ type: String }],
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "resolved", "unresolved"], 
    default: "pending" 
  },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High", "Critical"], 
    default: "Medium" 
  },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  reassignment_request: {
    is_requested: { type: Boolean, default: false },
    reason: { type: String }
  },
  sla_due_at: { type: Date },
  is_sla_breached: { type: Boolean, default: false },
  source: { type: String, enum: ["web", "telegram", "email"], default: "web" },
  telegram_chat_id: { type: String },
  customer_rating: { type: Number, min: 1, max: 5 },
  customer_feedback: { type: String },
  resolved_at: { type: Date },
  closed_at: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

complaintSchema.index({ status: 1 });
complaintSchema.index({ created_at: -1 });
complaintSchema.index({ customer_id: 1 });
complaintSchema.index({ assigned_to: 1 });
complaintSchema.index({ status: 1, created_at: -1 });

export default mongoose.model('Complaint', complaintSchema);

