import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. `${ticket_id}-${phone}`
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // TTL index: 1 hour expiration
});

export default mongoose.model('Otp', otpSchema);
