import asyncHandler from 'express-async-handler';
import Complaint from '../complaint/complaint.model.js';
import User from '../user/user.model.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalComplaints = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: 'pending' });
  const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
  const resolved = await Complaint.countDocuments({ status: 'resolved' });
  const breached = await Complaint.countDocuments({ is_sla_breached: true });

  const categoryDistribution = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const employeeWorkload = await User.find({ role: 'employee' })
    .select('name specialization activeTicketsCount')
    .sort({ activeTicketsCount: -1 });

  res.json({
    overview: { totalComplaints, pending, inProgress, resolved, breached },
    categoryDistribution,
    employeeWorkload
  });
});
