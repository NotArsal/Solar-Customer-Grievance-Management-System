import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: '.env' });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@natureteksolar.com' });
    if (!adminExists) {
      const password_hash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@natureteksolar.com',
        phone: '1234567890',
        password_hash,
        role: 'admin',
        is_active: true
      });
      console.log('Admin user created: admin@natureteksolar.com / admin123');
    }

    const employeeExists = await User.findOne({ email: 'staff@natureteksolar.com' });
    if (!employeeExists) {
      const password_hash = await bcrypt.hash('staff123', 10);
      await User.create({
        name: 'Support Staff',
        email: 'staff@natureteksolar.com',
        phone: '0987654321',
        password_hash,
        role: 'employee',
        is_active: true
      });
      console.log('Employee user created: staff@natureteksolar.com / staff123');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
