import { useState, useEffect } from 'react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') return navigate('/login');
    fetchTickets();
    fetchEmployees();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/v1/complaints');
      setTickets(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/v1/auth/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const handleAssign = async (ticketId, employeeId) => {
    try {
      await api.patch(`/v1/complaints/${ticketId}/assign`, { assigned_to: employeeId });
      fetchTickets();
    } catch (err) {
      alert('Failed to assign ticket');
    }
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'Pending').length,
    resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-primary">Admin Overview</h2>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-sm font-semibold text-gray-500 hover:text-brand-primary">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card border-l-4 border-l-brand-primary">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Total Tickets</p>
          <p className="text-5xl font-heading font-bold text-brand-primary mt-2">{stats.total}</p>
        </div>
        <div className="premium-card border-l-4 border-l-yellow-400">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Pending Issues</p>
          <p className="text-5xl font-heading font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="premium-card border-l-4 border-l-green-500">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Resolved</p>
          <p className="text-5xl font-heading font-bold text-green-600 mt-2">{stats.resolved}</p>
        </div>
      </div>

      <div className="premium-card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-xl text-brand-primary">System Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Ticket ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">SLA Breached</th>
                <th className="p-4 font-semibold">Assigned To</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tickets.map(t => (
                <tr key={t._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-brand-primary">{t.ticket_id}</td>
                  <td className="p-4 text-brand-text">{t.customer_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border shadow-sm ${t.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : t.status === 'Resolved' || t.status === 'Closed' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {t.is_sla_breached ? <span className="text-red-600 font-bold px-2 py-1 bg-red-50 rounded border border-red-200 text-xs">Breached</span> : <span className="text-green-600 px-2 py-1 bg-green-50 rounded border border-green-200 text-xs font-bold">On Track</span>}
                  </td>
                  <td className="p-4">
                    <select 
                      className="input-field py-1 px-2 text-xs cursor-pointer w-32" 
                      value={t.assigned_to?._id || ''} 
                      onChange={e => handleAssign(t._id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
