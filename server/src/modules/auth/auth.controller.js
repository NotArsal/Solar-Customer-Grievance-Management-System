import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import User from '../user/user.model.js';

const rateLimitCache = new Map();

const checkRateLimit = (ip, keyPrefix) => {
  const key = `${keyPrefix}_${ip}`;
  const now = Date.now();
  const record = rateLimitCache.get(key) || { count: 0, firstAttempt: now };
  
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    record.count = 1;
    record.firstAttempt = now;
  } else {
    record.count += 1;
  }
  rateLimitCache.set(key, record);
  return record.count <= 5; // Max 5 attempts per 15 minutes
};

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
  
  if (!checkRateLimit(req.ip, 'login')) {
    res.status(429);
    throw new Error('Too many login attempts, please try again later.');
  }

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

  if (!checkRateLimit(req.ip, 'otp')) {
    res.status(429);
    throw new Error('Too many OTP verification attempts, please try again later.');
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const employees = await User.find({ role: { $in: ['employee', 'admin'] }, is_active: true })
    .select('name email role')
    .skip(skip)
    .limit(limit)
    .lean();
    
  const total = await User.countDocuments({ role: { $in: ['employee', 'admin'] }, is_active: true });
    
  res.json({
    employees,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});
