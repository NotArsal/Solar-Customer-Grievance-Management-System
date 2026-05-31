import mongoose from 'mongoose';
import Complaint from './src/modules/complaint/complaint.model.js';
import Category from './src/modules/routing/category.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Remove all complaints
    await Complaint.deleteMany({});
    console.log('Deleted all unnecessary tickets');

    // Check if categories exist, if not create them
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      const categories = [
        { name: 'Inverter Error', priority: 'High', assigned_department: 'Inverter', sla_hours: 24 },
        { name: 'Panel Damage', priority: 'Critical', assigned_department: 'Solar Panel', sla_hours: 12 },
        { name: 'Battery Issue', priority: 'High', assigned_department: 'Battery', sla_hours: 24 },
        { name: 'General Inquiry', priority: 'Low', assigned_department: 'General', sla_hours: 72 },
        { name: 'Maintenance Request', priority: 'Medium', assigned_department: 'Service', sla_hours: 48 }
      ];
      await Category.insertMany(categories);
      console.log('Seeded initial routing categories');
    } else {
      console.log('Categories already exist');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
