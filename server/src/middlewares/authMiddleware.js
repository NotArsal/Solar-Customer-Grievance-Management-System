import admin from '../config/firebase.js';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find the user in our MongoDB using their Firebase UID
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Attach the user object to the request so the next function can use it
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Role-based Access Control (RBAC) Middleware
export const requireRole = (rolesArray) => {
  return (req, res, next) => {
    if (!req.user || !rolesArray.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};