import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["customer", "employee", "admin", "superadmin"], default: "customer" },
  department: { type: String },
  specialization: { type: String, enum: ["Solar Panel", "Inverter", "Battery", "Service", "Other", "General"], default: "General" },
  activeTicketsCount: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('User', userSchema);
