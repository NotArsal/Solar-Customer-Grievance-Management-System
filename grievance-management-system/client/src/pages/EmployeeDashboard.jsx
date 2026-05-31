import { useState, useEffect } from 'react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateNote, setUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) return navigate('/login');
    setCurrentUser(user);
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/v1/complaints');
      setTickets(res.data);
      if (selectedTicket) {
        const updated = res.data.find(t => t._id === selectedTicket._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/v1/complaints/${selectedTicket._id}/status`, {
        status: newStatus,
        note: updateNote,
        is_public: true
      });
      setUpdateNote('');
      fetchTickets();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleClaim = async (ticketId) => {
    try {
      await api.patch(`/v1/complaints/${ticketId}/assign`, { assigned_to: currentUser.id });
      fetchTickets();
    } catch (err) {
      alert('Failed to claim ticket');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-primary">Support Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-brand-text">Hi, {currentUser?.name}</span>
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Ticket ID</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Assigned</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tickets.map(t => (
                <tr key={t._id} className={`border-b border-gray-50 transition-colors ${selectedTicket?._id === t._id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="p-4 font-bold text-brand-primary">{t.ticket_id}</td>
                  <td className="p-4 text-brand-text truncate max-w-[150px]">{t.subject}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border shadow-sm ${t.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : t.status === 'Resolved' || t.status === 'Closed' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {t.assigned_to ? (
                      <span className="text-xs font-semibold text-gray-600">{t.assigned_to.name}</span>
                    ) : (
                      <button onClick={() => handleClaim(t._id)} className="text-xs px-2 py-1 bg-brand-primary text-white rounded hover:bg-brand-secondary font-semibold transition-colors">
                        Claim
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <button onClick={() => { setSelectedTicket(t); setNewStatus(t.status); }} className="text-brand-secondary hover:text-brand-primary font-semibold underline underline-offset-2">View</button>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          {selectedTicket ? (
            <div className="premium-card sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-brand-primary border-b border-gray-100 pb-3">Update Ticket</h3>
              <div className="space-y-4 text-sm mb-6">
                <p><strong>ID:</strong> <span className="font-mono text-brand-primary">{selectedTicket.ticket_id}</span></p>
                <p><strong>Customer:</strong> {selectedTicket.customer_name} <span className="text-gray-400">({selectedTicket.customer_phone})</span></p>
                <p><strong>Product:</strong> {selectedTicket.product_type}</p>
                <div>
                  <strong>Description:</strong>
                  <p className="text-gray-600 mt-2 p-3 bg-gray-50 border border-gray-100 rounded leading-relaxed">{selectedTicket.description}</p>
                </div>
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <strong>Attachments:</strong>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTicket.attachments.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded border overflow-hidden shadow-sm hover:opacity-80 transition-opacity">
                          <img src={url} alt="Attachment" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                          <div className="hidden w-full h-full bg-gray-100 items-center justify-center text-xs text-gray-500 text-center p-1">View File</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">New Status</label>
                  <select className="input-field py-3 px-3 text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option>Pending</option>
                    <option>In-Progress</option>
                    <option>On-Hold</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Update Note</label>
                  <textarea required rows="3" className="input-field py-3 px-3 text-sm resize-none" placeholder="What actions were taken?" value={updateNote} onChange={e => setUpdateNote(e.target.value)} />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="btn-primary py-2 px-4 text-sm flex-1">Save Update</button>
                  <button type="button" onClick={() => setSelectedTicket(null)} className="py-2 px-4 bg-gray-100 text-gray-700 rounded font-semibold text-sm hover:bg-gray-200 transition-colors">Close</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="premium-card flex flex-col items-center justify-center h-64 text-gray-400 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Select a ticket from the list to view details and update status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
