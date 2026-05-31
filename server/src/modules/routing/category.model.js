import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  assigned_department: { type: String, required: true },
  sla_hours: { type: Number, required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Category', categorySchema);
