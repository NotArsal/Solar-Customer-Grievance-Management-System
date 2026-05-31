import mongoose from 'mongoose';

const slaConfigSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  resolution_hours: { type: Number, required: true },
  priority_multipliers: {
    Low: { type: Number, default: 1.5 },
    Medium: { type: Number, default: 1.0 },
    High: { type: Number, default: 0.75 },
    Critical: { type: Number, default: 0.5 }
  },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { updatedAt: 'updated_at', createdAt: false } });

export default mongoose.model('SLAConfig', slaConfigSchema);
