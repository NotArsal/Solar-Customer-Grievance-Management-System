import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './modules/user/user.model.js';
import Category from './modules/routing/category.model.js';

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

    const categories = [
      { name: "Physical Damage (Cracks/Shatter)", assigned_department: "Solar Panel", priority: "High", sla_hours: 24 },
      { name: "Low Energy Output", assigned_department: "Solar Panel", priority: "Medium", sla_hours: 48 },
      { name: "Sparking / Wiring Issue", assigned_department: "Solar Panel", priority: "Critical", sla_hours: 12 },
      { name: "Debris / Shading Issue", assigned_department: "Solar Panel", priority: "Low", sla_hours: 72 },
      { name: "Not Turning On", assigned_department: "Inverter", priority: "High", sla_hours: 24 },
      { name: "Error Code Displayed", assigned_department: "Inverter", priority: "Medium", sla_hours: 48 },
      { name: "Wi-Fi / Monitoring Disconnect", assigned_department: "Inverter", priority: "Low", sla_hours: 72 },
      { name: "Overheating", assigned_department: "Inverter", priority: "Critical", sla_hours: 12 },
      { name: "Not Holding Charge", assigned_department: "Battery", priority: "High", sla_hours: 24 },
      { name: "Battery Replacement", assigned_department: "Battery", priority: "Medium", sla_hours: 48 },
      { name: "Swelling / Leaking", assigned_department: "Battery", priority: "Critical", sla_hours: 12 },
      { name: "Fast Discharging", assigned_department: "Battery", priority: "Medium", sla_hours: 48 },
      { name: "Billing Query", assigned_department: "Service", priority: "Low", sla_hours: 72 },
      { name: "Installation Check", assigned_department: "Service", priority: "Medium", sla_hours: 48 },
      { name: "Other", assigned_department: "Solar Panel", priority: "Medium", sla_hours: 48 },
      { name: "Other", assigned_department: "Inverter", priority: "Medium", sla_hours: 48 },
      { name: "Other", assigned_department: "Battery", priority: "Medium", sla_hours: 48 },
      { name: "Other", assigned_department: "Service", priority: "Medium", sla_hours: 48 }
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name, assigned_department: cat.assigned_department });
      if (!exists) {
        await Category.create(cat);
        console.log(`Seeded category: ${cat.name} (${cat.assigned_department})`);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
