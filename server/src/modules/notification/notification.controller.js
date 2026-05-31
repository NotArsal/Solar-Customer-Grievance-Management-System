import asyncHandler from 'express-async-handler';
import Notification from './notification.model.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user_id: req.user.id })
    .sort({ created_at: -1 })
    .limit(50);
  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user_id: req.user.id },
    { is_read: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  res.json(notification);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user_id: req.user.id, is_read: false },
    { is_read: true }
  );
  res.json({ message: 'All notifications marked as read' });
});
