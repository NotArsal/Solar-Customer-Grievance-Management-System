import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    unique: true 
    // We will auto-generate this in our controller (e.g., NT-8431)
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
    // Left empty until an Admin assigns it to an Employee
  },
  category: { 
    type: String, 
    required: true 
  },
  plantReference: { 
    type: String // Optional field for Solar Array ID
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING'
  },
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
    default: 'NORMAL'
  },
  attachments: [
    { type: String } // Array of image/PDF URLs (e.g., Cloudinary URLs)
  ],
  resolutionNotes: { 
    type: String // Notes added by the employee when resolving the ticket
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Ticket', ticketSchema);