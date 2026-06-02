import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './src/modules/user/user.model.js';

dotenv.config({ path: '.env' });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const staffList = [
      { name: 'Solar Panel Staff', email: 'solar@natureteksolar.com', specialization: 'Solar Panel' },
      { name: 'Inverter Staff', email: 'inverter@natureteksolar.com', specialization: 'Inverter' },
      { name: 'Battery Staff', email: 'battery@natureteksolar.com', specialization: 'Battery' },
      { name: 'Service Staff', email: 'service@natureteksolar.com', specialization: 'Service' }
    ];

    for (let s of staffList) {
      const exists = await User.findOne({ email: s.email });
      if (!exists) {
        const password_hash = await bcrypt.hash('staff123', 10);
        await User.create({
          name: s.name,
          email: s.email,
          phone: '0000000000',
          password_hash,
          role: 'employee',
          specialization: s.specialization,
          is_active: true
        });
        console.log('Created:', s.email);
      } else {
        console.log('Already exists:', s.email);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
