import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import User from '../user/user.model.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.is_active) {
    res.status(401);
    throw new Error('Invalid credentials or inactive account');
  }
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  user.last_login = new Date();
  await user.save();
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
});

const otpStore = new Map();

export const sendOTP = asyncHandler(async (req, res) => {
  const { ticket_id, phone } = req.body;
  const otp = '123456'; 
  otpStore.set(`${ticket_id}-${phone}`, otp);
  res.json({ message: 'OTP sent successfully (Demo: use 123456)' });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { ticket_id, phone, otp } = req.body;
  const storedOtp = otpStore.get(`${ticket_id}-${phone}`);
  if (storedOtp && storedOtp === otp) {
    otpStore.delete(`${ticket_id}-${phone}`);
    const token = jwt.sign({ ticket_id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401);
    throw new Error('Invalid OTP');
  }
});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: { $in: ['employee', 'admin'] }, is_active: true })
    .select('name email role')
    .lean();
  res.json(employees);
});
