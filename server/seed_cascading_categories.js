import mongoose from 'mongoose';
import Category from './src/modules/routing/category.model.js';
import dotenv from 'dotenv';
dotenv.config();

const seedCategories = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("No MONGO_URI provided.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    
    // Drop the unique name index if it exists
    await Category.collection.dropIndex("name_1").catch(() => {});
    // First, clear old categories to prevent clutter
    await Category.deleteMany({});

    const productIssueMapping = {
      "Solar Panel": [
        "Physical Damage (Cracks/Shatter)", 
        "Low Energy Output", 
        "Sparking / Wiring Issue", 
        "Debris / Shading Issue",
        "Other"
      ],
      "Inverter": [
        "Not Turning On", 
        "Error Code Displayed", 
        "Wi-Fi / Monitoring Disconnect", 
        "Overheating",
        "Other"
      ],
      "Battery": [
        "Not Holding Charge", 
        "Battery Replacement", 
        "Swelling / Leaking", 
        "Fast Discharging",
        "Other"
      ],
      "Service": [
        "Billing Query", 
        "Installation Check", 
        "Other"
      ]
    };

    let count = 0;
    for (const [product, issues] of Object.entries(productIssueMapping)) {
      for (const issue of issues) {
        let priority = 'Medium';
        if (issue.includes('Damage') || issue.includes('Sparking') || issue.includes('Not Turning On') || issue.includes('Error Code') || issue.includes('Not Holding Charge') || issue.includes('Swelling')) {
          priority = 'High';
        }
        await Category.create({
          name: issue,
          priority: priority,
          assigned_department: product,
          sla_hours: priority === 'High' ? 24 : 72,
          is_active: true
        });
        count++;
      }
    }

    console.log(`Successfully seeded ${count} cascading categories into DB!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

seedCategories();
