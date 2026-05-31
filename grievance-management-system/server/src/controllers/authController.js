import User from '../models/User.js';

export const syncUser = async (req, res) => {
  try {
    const { firebaseUid, email, name, role } = req.body;

    if (!firebaseUid || !email || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user in MongoDB
      user = await User.create({
        firebaseUid,
        email,
        name,
        role: role || 'CUSTOMER' // Default to customer
      });
      console.log(`New user synced to DB: ${email}`);
    }

    res.status(200).json({
      message: 'User synced successfully',
      user
    });
  } catch (error) {
    console.error('Sync User Error:', error);
    res.status(500).json({ message: 'Server error syncing user' });
  }
};