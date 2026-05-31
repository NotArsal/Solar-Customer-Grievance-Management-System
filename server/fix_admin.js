import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const adminEmail = 'admin@naturetek.com';
    const password = 'admin123';
    const password_hash = await bcrypt.hash(password, 10);

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('Admin user not found. Creating one...');
      admin = new User({
        name: 'System Admin',
        email: adminEmail,
        phone: '9999999999',
        password_hash,
        role: 'admin'
      });
    } else {
      console.log('Admin user found. Updating password_hash...');
      admin.password_hash = password_hash;
    }

    await admin.save();
    console.log('Admin user updated successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing admin:', err);
    process.exit(1);
  }
};

fixAdmin();
