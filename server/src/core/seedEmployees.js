import bcrypt from 'bcrypt';
import User from '../modules/user/user.model.js';

export const seedEmployees = async () => {
  try {
    const staffList = [
      { name: 'Solar Staff', email: 'solar@natureteksolar.com', specialization: 'Solar Panel' },
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
        console.log(`Auto-seeded employee: ${s.email}`);
      }
    }
  } catch (err) {
    console.error('Error auto-seeding employees:', err);
  }
};
