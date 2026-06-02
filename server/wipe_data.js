import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from './src/modules/complaint/complaint.model.js';
import TicketHistory from './src/modules/complaint/ticketHistory.model.js';
import Category from './src/modules/routing/category.model.js';
import Notification from './src/modules/notification/notification.model.js';
import User from './src/modules/user/user.model.js';

dotenv.config(); // make sure your .env has MONGO_URI

const wipeDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is missing. Please run this where your .env file is located, or set the environment variable.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete all complaints and their history
    await Complaint.deleteMany({});
    console.log('Deleted all Complaints');

    await TicketHistory.deleteMany({});
    console.log('Deleted all Ticket History');

    // 2. Delete all categories and notifications
    await Category.deleteMany({});
    console.log('Deleted all Routing Categories');

    await Notification.deleteMany({});
    console.log('Deleted all Notifications');

    // 3. Delete all users EXCEPT admin and employees
    const deletedUsers = await User.deleteMany({ role: { $nin: ['admin', 'employee', 'superadmin'] } });
    console.log(`Deleted ${deletedUsers.deletedCount} customer accounts`);

    // Reset employee active ticket counts to 0
    await User.updateMany({ role: 'employee' }, { $set: { activeTicketsCount: 0 } });
    console.log('Reset all staff workload counts to 0');

    console.log('✅ Database wipe complete! Only Admin and Staff accounts remain.');
    process.exit(0);
  } catch (err) {
    console.error('Error wiping database:', err);
    process.exit(1);
  }
};

wipeDatabase();
