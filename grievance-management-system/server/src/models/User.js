import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: {
    type: String,
    enum: ['CUSTOMER', 'EMPLOYEE', 'ADMIN'],
    default: 'CUSTOMER'
  },
  // Department is only populated if the user is an EMPLOYEE
  department: { 
    type: String 
  }, 
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.model('User', userSchema);