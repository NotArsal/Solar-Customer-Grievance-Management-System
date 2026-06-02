import mongoose from 'mongoose';
import Category from './src/modules/routing/category.model.js';

const seedCategories = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("No MONGO_URI provided.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = [
      { name: 'Solar Panel Issue', priority: 'High', assigned_department: 'Solar Panel', sla_hours: 24, is_active: true },
      { name: 'Inverter Error', priority: 'High', assigned_department: 'Inverter', sla_hours: 24, is_active: true },
      { name: 'Battery Replacement', priority: 'Medium', assigned_department: 'Battery', sla_hours: 48, is_active: true },
      { name: 'General Service', priority: 'Low', assigned_department: 'Service', sla_hours: 72, is_active: true }
    ];

    for (let c of categories) {
      const exists = await Category.findOne({ name: c.name });
      if (!exists) {
        await Category.create(c);
        console.log('Created category:', c.name);
      }
    }

    console.log('Categories restored.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

seedCategories();
