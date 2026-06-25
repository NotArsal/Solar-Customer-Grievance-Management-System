import { useState, useEffect, useCallback } from 'react';
import api from '../../../config/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStatusStyles } from '../../../utils/statusColors';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [newCat, setNewCat] = useState({ name: '', priority: 'Medium', assigned_department: 'General', sla_hours: 48 });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get('/v1/complaints');
      setTickets(res.data.complaints || []);
    } catch {
      toast.error('Session expired or unauthorized');
      navigate('/auth');
    }
  }, [navigate]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get('/v1/auth/employees');
      setEmployees(res.data.employees || []);
    } catch {
      toast.error('Failed to load employees');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/v1/reports/dashboard');
      setStats(res.data);
    } catch {
      toast.error('Failed to load dashboard stats');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/v1/routing-categories');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load routing categories');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || (user.role !== 'admin' && user.role !== 'superadmin')) return navigate('/auth');
    
    let isMounted = true;
    setTimeout(() => {
      Promise.all([
        fetchTickets(),
        fetchEmployees(),
        fetchStats(),
        fetchCategories()
      ]).finally(() => { if (isMounted) setIsLoading(false); });
    }, 0);
    return () => { isMounted = false; };
  }, [navigate, fetchTickets, fetchEmployees, fetchStats, fetchCategories]);

  // Functions moved above with useCallback

  const handleAssign = async (ticketId, employeeId) => {
    if (!employeeId) return;
    try {
      await api.patch(`/v1/complaints/${ticketId}/assign`, { assigned_to: employeeId });
      toast.success('Ticket assigned successfully!');
      fetchTickets();
    } catch { toast.error('Failed to assign ticket'); }
  };

  const handlePriorityOverride = async (ticketId, priority) => {
    try {
      await api.patch(`/v1/complaints/${ticketId}/priority`, { priority, reason: 'Admin Override' });
      toast.success('Priority overridden successfully!');
      fetchTickets();
    } catch { toast.error('Failed to override priority'); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/routing-categories', newCat);
      setNewCat({ name: '', priority: 'Medium', assigned_department: 'General', sla_hours: 48 });
      toast.success('Category created successfully!');
      fetchCategories();
    } catch { toast.error('Failed to create category'); }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/v1/routing-categories/${id}`);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-[36px] tracking-display-lg font-medium text-brand-ink">Admin Overview</h2>
        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/auth'); window.location.reload(); }} className="text-sm font-medium text-brand-ink-mute hover:text-brand-ink transition-colors">Logout</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex space-x-4 border-b border-brand-hairline">
        <button onClick={() => setActiveTab('tickets')} className={`pb-3 px-4 font-medium text-sm transition-colors ${activeTab === 'tickets' ? 'border-b-[3px] border-brand-primary text-brand-ink' : 'text-brand-ink-mute hover:text-brand-ink'}`}>All Tickets</button>
        <button onClick={() => setActiveTab('routing')} className={`pb-3 px-4 font-medium text-sm transition-colors ${activeTab === 'routing' ? 'border-b-[3px] border-brand-primary text-brand-ink' : 'text-brand-ink-mute hover:text-brand-ink'}`}>Routing Table</button>
        <button onClick={() => setActiveTab('analytics')} className={`pb-3 px-4 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'border-b-[3px] border-brand-primary text-brand-ink' : 'text-brand-ink-mute hover:text-brand-ink'}`}>Analytics</button>
      </div>

      {activeTab === 'tickets' && (
        <div className="card-feature-light p-0 overflow-hidden border-brand-hairline shadow-level-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-canvas-soft border-b border-brand-hairline text-[11px] uppercase tracking-wider text-brand-ink-mute font-medium">
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Issue</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">SLA</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Reassign Request</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map(t => (
                  <tr key={t._id} className="border-b border-brand-hairline-cool hover:bg-brand-canvas-soft transition-colors">
                    <td className="p-4 font-mono font-medium text-brand-ink">{t.ticket_id}</td>
                    <td className="p-4 text-brand-ink-secondary">{t.customer_name}</td>
                    <td className="p-4">
                      <div className="relative group">
                        <div className="text-sm font-medium text-brand-ink-secondary max-w-[150px] truncate cursor-pointer underline decoration-brand-hairline-strong underline-offset-4 hover:decoration-brand-primary transition-colors">
                          {t.subject}
                        </div>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-80 p-4 bg-brand-canvas border border-brand-hairline-strong shadow-level-2 rounded-md text-sm text-brand-ink whitespace-pre-wrap">
                          <span className="font-medium text-brand-ink block mb-2 border-b border-brand-hairline-cool pb-1">Full Description</span>
                          <span className="text-xs text-brand-ink-mute block mb-2">{t.description}</span>
                          {t.attachments?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-brand-hairline-cool">
                              <span className="font-medium text-[10px] uppercase text-brand-ink-mute block mb-2">Attachments</span>
                              <div className="flex flex-wrap gap-2">
                                {t.attachments.map((url, idx) => (
                                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block w-12 h-12 rounded border border-brand-hairline overflow-hidden hover:border-brand-primary transition-colors">
                                    <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wide border shadow-level-1 ${getStatusStyles(t.status).badge}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className={`text-xs p-1 rounded-sm font-medium border focus:outline-none ${t.priority === 'High' || t.priority === 'Critical' ? 'text-red-600 border-red-200 bg-red-50' : 'text-brand-ink border-brand-hairline-strong bg-brand-canvas'}`}
                        value={t.priority}
                        onChange={e => handlePriorityOverride(t._id, e.target.value)}
                      >
                        <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {t.is_sla_breached ? <span className="text-red-600 font-medium px-2 py-1 bg-red-50 rounded-sm border border-red-200 text-[10px] uppercase">Breached</span> : <span className="text-brand-primary-deep px-2 py-1 bg-brand-canvas rounded-sm border border-brand-hairline text-[10px] uppercase font-medium">On Track</span>}
                    </td>
                    <td className="p-4">
                      <select 
                        className="input-field py-1 px-2 text-xs cursor-pointer w-32 border-brand-hairline-strong" 
                        value={t.assigned_to?._id || ''} 
                        onChange={e => handleAssign(t._id, e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {employees.map(emp => (
                          <option key={emp._id} value={emp._id}>{emp.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      {t.reassignment_request?.is_requested ? (
                        <div className="relative group">
                          <div className="text-[10px] leading-tight text-red-600 font-medium border border-red-200 bg-red-50 rounded-sm p-1 max-w-[160px] break-words line-clamp-3 cursor-pointer">
                            REQUESTED: {t.reassignment_request.reason}
                          </div>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 w-64 p-3 bg-brand-canvas border border-brand-hairline-strong shadow-level-2 rounded-md text-xs text-brand-ink whitespace-pre-wrap">
                            <span className="font-medium text-red-600 block mb-1">Full Reason:</span>
                            {t.reassignment_request.reason}
                          </div>
                        </div>
                      ) : <span className="text-brand-ink-faint text-xs">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'routing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="card-feature-light">
              <h3 className="text-lg font-medium mb-4 text-brand-ink">Add New Rule</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <input required placeholder="Category Name (e.g. Inverter Error)" className="input-field text-sm" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
                <select className="input-field text-sm" value={newCat.priority} onChange={e => setNewCat({...newCat, priority: e.target.value})}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
                <select className="input-field text-sm" value={newCat.assigned_department} onChange={e => setNewCat({...newCat, assigned_department: e.target.value})}>
                  <option>Solar Panel</option><option>Inverter</option><option>Battery</option><option>Service</option><option>General</option>
                </select>
                <input required type="number" placeholder="SLA Hours (e.g. 48)" className="input-field text-sm" value={newCat.sla_hours} onChange={e => setNewCat({...newCat, sla_hours: Number(e.target.value)})} />
                <button type="submit" className="btn-primary w-full text-sm py-2">Create Rule</button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="card-feature-light p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-canvas-soft border-b border-brand-hairline text-[11px] uppercase tracking-wider text-brand-ink-mute font-medium">
                      <th className="p-4">Category</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">SLA (Hrs)</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {categories.map(c => (
                      <tr key={c._id} className="border-b border-brand-hairline-cool text-brand-ink-secondary hover:bg-brand-canvas-soft">
                        <td className="p-4 font-medium text-brand-ink">{c.name}</td>
                        <td className="p-4">{c.priority}</td>
                        <td className="p-4">{c.assigned_department}</td>
                        <td className="p-4">{c.sla_hours}</td>
                        <td className="p-4"><button onClick={() => handleDeleteCategory(c._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-feature-light border-l-4 border-l-brand-ink">
              <p className="text-[11px] font-medium uppercase tracking-wider text-brand-ink-mute">Total Tickets</p>
              <p className="text-[36px] tracking-display-lg font-medium text-brand-ink mt-1">{stats.overview.totalComplaints}</p>
            </div>
            <div className="card-feature-light border-l-4 border-l-brand-hairline-strong">
              <p className="text-[11px] font-medium uppercase tracking-wider text-brand-ink-mute">Pending</p>
              <p className="text-[36px] tracking-display-lg font-medium text-brand-ink-secondary mt-1">{stats.overview.pending}</p>
            </div>
            <div className="card-feature-light border-l-4 border-l-brand-primary">
              <p className="text-[11px] font-medium uppercase tracking-wider text-brand-ink-mute">Resolved</p>
              <p className="text-[36px] tracking-display-lg font-medium text-brand-primary-deep mt-1">{stats.overview.resolved}</p>
            </div>
            <div className="card-feature-light border-l-4 border-l-red-500">
              <p className="text-[11px] font-medium uppercase tracking-wider text-brand-ink-mute">SLA Breached</p>
              <p className="text-[36px] tracking-display-lg font-medium text-red-600 mt-1">{stats.overview.breached}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-feature-light">
              <h3 className="text-lg font-medium mb-4 text-brand-ink">Category Distribution</h3>
              <div className="space-y-3">
                {stats.categoryDistribution.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-brand-hairline-cool pb-2">
                    <span className="text-sm text-brand-ink-secondary font-medium">{c._id}</span>
                    <span className="pill-tag-green">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-feature-light">
              <h3 className="text-lg font-medium mb-4 text-brand-ink">Employee Workload</h3>
              <div className="space-y-3">
                {stats.employeeWorkload.map(emp => (
                  <div key={emp._id} className="flex justify-between items-center border-b border-brand-hairline-cool pb-2">
                    <div>
                      <p className="text-sm font-medium text-brand-ink">{emp.name}</p>
                      <p className="text-[10px] uppercase text-brand-ink-mute">{emp.specialization}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-medium border ${emp.activeTicketsCount > 5 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-brand-canvas-soft text-brand-ink border-brand-hairline'}`}>
                      {emp.activeTicketsCount} Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
