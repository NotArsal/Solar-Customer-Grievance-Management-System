import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateNote, setUpdateNote] = useState('');
  const [status, setStatus] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const navigate = useNavigate();

  const currentUser = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get('/v1/complaints');
      setTickets(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || currentUser.role !== 'employee') return navigate('/auth');
    fetchTickets();
  }, [navigate, currentUser, fetchTickets]);
  // fetchTickets moved above
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/v1/complaints/${selectedTicket._id}/status`, { status, note: updateNote });
      setSelectedTicket(null);
      setUpdateNote('');
      toast.success('Ticket updated successfully!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <h2 className="text-[28px] tracking-display-md font-medium text-brand-ink mb-6">My Workspace</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-sm text-brand-ink-mute border border-brand-hairline rounded-lg bg-brand-canvas-soft">
              No tickets currently assigned to you.
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t._id} 
                onClick={() => { setSelectedTicket(t); setStatus(t.status); setUpdateNote(''); }}
                className={`p-4 border rounded-md cursor-pointer transition-colors ${selectedTicket?._id === t._id ? 'border-brand-primary bg-brand-canvas shadow-level-1' : 'border-brand-hairline bg-brand-canvas-soft hover:bg-brand-canvas hover:border-brand-hairline-strong'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm font-medium text-brand-ink">{t.ticket_id}</span>
                  <span className="text-[10px] uppercase font-medium bg-brand-canvas border border-brand-hairline px-2 py-0.5 rounded-sm text-brand-ink-secondary">{t.status}</span>
                </div>
                <p className="text-sm font-medium text-brand-ink-secondary truncate">{t.subject}</p>
                <div className="flex justify-between items-center mt-3 text-[10px] text-brand-ink-mute">
                  <span>{t.priority} Priority</span>
                  {t.is_sla_breached && <span className="text-red-600 font-medium">SLA Breached</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedTicket ? (
          <div className="card-feature-light animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[28px] tracking-display-md font-medium text-brand-ink leading-tight">{selectedTicket.subject}</h3>
                <p className="text-sm text-brand-ink-mute mt-2">ID: <span className="font-mono font-medium text-brand-ink">{selectedTicket.ticket_id}</span> • Product: <span className="font-medium text-brand-ink">{selectedTicket.product_type}</span></p>
              </div>
            </div>

            <div className="bg-brand-canvas-soft p-4 rounded-md border border-brand-hairline-cool mb-6">
              <p className="text-xs font-medium uppercase text-brand-ink-mute mb-2">Customer Description</p>
              <p className="text-sm text-brand-ink whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 border-t border-brand-hairline-cool pt-6">
              <h4 className="text-lg font-medium text-brand-ink">Update Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-ink-mute mb-1">New Status</label>
                  <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="unresolved">Unresolved</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Update Note (visible to customer)</label>
                <textarea required rows="3" className="input-field resize-none" value={updateNote} onChange={e => setUpdateNote(e.target.value)} />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Update'}
                </button>
                <button type="button" onClick={() => setSelectedTicket(null)} className="btn-secondary" disabled={isSubmitting}>Close</button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-brand-hairline-cool">
              <h4 className="text-sm font-medium text-brand-ink mb-3">Request Reassignment</h4>
              <div className="flex space-x-2">
                <input 
                  value={reassignReason} 
                  onChange={e => setReassignReason(e.target.value)} 
                  placeholder="Reason for reassignment..." 
                  className="input-field text-sm flex-1" 
                  disabled={isReassigning}
                />
                <button 
                  disabled={isReassigning}
                  onClick={async () => {
                    if (!reassignReason) return toast.error('Provide a reason');
                    setIsReassigning(true);
                    try {
                      await api.patch(`/v1/complaints/${selectedTicket._id}/reassign-request`, { reason: reassignReason });
                      toast.success('Reassignment requested');
                      setReassignReason('');
                      fetchTickets();
                    } catch (err) { 
                      toast.error('Error requesting reassignment'); 
                    } finally {
                      setIsReassigning(false);
                    }
                  }} 
                  className="bg-brand-canvas text-red-600 font-medium px-4 py-2 rounded-sm border border-red-200 hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
                >
                  {isReassigning ? 'Requesting...' : 'Request'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-feature-light flex flex-col items-center justify-center h-64 text-center border-dashed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-hairline-strong mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-brand-ink-mute font-medium text-sm">Select a ticket from your workspace to view details and update status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
