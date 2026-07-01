import { asyncHandler } from '../../core/utils/asyncHandler.js';
import Complaint from '../complaint/complaint.model.js';
import User from '../user/user.model.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const overviewStats = await Complaint.aggregate([
    {
      $facet: {
        totalComplaints: [{ $count: "count" }],
        pending: [{ $match: { status: 'pending' } }, { $count: "count" }],
        inProgress: [{ $match: { status: 'in-progress' } }, { $count: "count" }],
        resolved: [{ $match: { status: 'resolved' } }, { $count: "count" }],
        breached: [{ $match: { is_sla_breached: true } }, { $count: "count" }]
      }
    }
  ]);
  
  const stats = overviewStats[0];
  const totalComplaints = stats.totalComplaints[0]?.count || 0;
  const pending = stats.pending[0]?.count || 0;
  const inProgress = stats.inProgress[0]?.count || 0;
  const resolved = stats.resolved[0]?.count || 0;
  const breached = stats.breached[0]?.count || 0;

  const categoryDistribution = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const employeeWorkload = await User.find({ role: 'employee' })
    .select('name specialization activeTicketsCount')
    .sort({ activeTicketsCount: -1 })
    .limit(50);

  res.json({
    overview: { totalComplaints, pending, inProgress, resolved, breached },
    categoryDistribution,
    employeeWorkload
  });
});
