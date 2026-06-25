import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import User from '../user/user.model.js';

export const customerRegister = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email: String(email) });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email, phone, password_hash, role: 'customer'
  });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email) });
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

import Otp from './otp.model.js';

export const sendOTP = asyncHandler(async (req, res) => {
  const { ticket_id, phone } = req.body;
  if (!ticket_id || !phone) {
    res.status(400);
    throw new Error('ticket_id and phone are required');
  }
  const otp = '123456'; 
  const key = `${ticket_id}-${phone}`;
  await Otp.findOneAndUpdate({ key }, { key, otp }, { upsert: true, new: true });
  res.json({ message: 'OTP sent successfully (Demo: use 123456)' });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { ticket_id, phone, otp } = req.body;
  if (!ticket_id || !phone || !otp) {
    res.status(400);
    throw new Error('ticket_id, phone, and otp are required');
  }
  const key = `${ticket_id}-${phone}`;
  const storedOtp = await Otp.findOne({ key });
  
  if (storedOtp && storedOtp.otp === otp) {
    await Otp.deleteOne({ key });
    const token = jwt.sign({ ticket_id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401);
    throw new Error('Invalid or expired OTP');
  }
});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: { $in: ['employee', 'admin'] }, is_active: true })
    .select('name email role')
    .lean();
  res.json(employees);
});
