import { useState, useEffect } from 'react';
import api from '../../../config/axios';
import { useSearchParams } from 'react-router-dom';

export default function TrackTicket() {
  const [searchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get('id') || '');
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch(null, searchParams.get('id'));
    }
  }, [searchParams]);

  const handleSearch = async (e, forceId = null) => {
    if (e) e.preventDefault();
    const idToTrack = forceId || ticketId;
    if (!idToTrack) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.get(`/v1/complaints/${idToTrack}/track`);
      setTicket(res.data.complaint);
      setHistory(res.data.history || []);
    } catch (err) {
      setError('Ticket not found or invalid ID.');
      setTicket(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-feature-light">
        <h2 className="text-[28px] tracking-display-md font-medium mb-6 text-brand-ink">Track Your Ticket</h2>
        
        <form onSubmit={handleSearch} className="flex space-x-3 mb-8">
          <input 
            type="text" 
            placeholder="Enter Ticket ID (e.g. NTS-2026-0001)" 
            className="input-field flex-1 text-sm font-mono tracking-wider" 
            value={ticketId} 
            onChange={e => setTicketId(e.target.value)} 
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}

        {ticket && (
          <div className="animate-fade-in border-t border-brand-hairline pt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-medium text-brand-ink">{ticket.subject}</h3>
                <p className="text-sm text-brand-ink-mute mt-1">Ticket ID: <span className="font-mono text-brand-ink font-medium">{ticket.ticket_id}</span></p>
              </div>
              <span className="text-xs uppercase font-medium bg-brand-canvas-soft border border-brand-hairline-strong px-3 py-1 rounded-sm text-brand-ink-secondary">
                {ticket.status}
              </span>
            </div>

            <div className="bg-brand-canvas-soft rounded-md p-4 mb-8 border border-brand-hairline-cool text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-brand-ink-mute text-[10px] uppercase font-medium">Category</p>
                  <p className="font-medium text-brand-ink mt-1">{ticket.category_ref?.name || ticket.product_type}</p>
                </div>
                <div>
                  <p className="text-brand-ink-mute text-[10px] uppercase font-medium">Priority</p>
                  <p className={`font-medium mt-1 ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'text-red-600' : 'text-brand-ink'}`}>{ticket.priority}</p>
                </div>
                <div>
                  <p className="text-brand-ink-mute text-[10px] uppercase font-medium">Created</p>
                  <p className="font-medium text-brand-ink mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-brand-ink-mute text-[10px] uppercase font-medium">Assigned To</p>
                  <p className="font-medium text-brand-ink mt-1">{ticket.assigned_to ? ticket.assigned_to.name : 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-medium text-brand-ink mb-6">Timeline</h4>
            <div className="relative border-l-2 border-brand-hairline-strong ml-4 space-y-8">
              {history.map((h, i) => {
                const isLatest = i === 0;
                let actionText = h.action;
                let Icon = null;
                let iconColor = "text-brand-ink-mute";
                let bgColor = "bg-brand-canvas-soft";
                let borderColor = "border-brand-hairline-strong";

                if (h.action === 'status_change') {
                  actionText = `Status updated to ${h.to_status}`;
                  iconColor = isLatest ? "text-white" : "text-brand-primary";
                  bgColor = isLatest ? "bg-brand-primary" : "bg-brand-canvas";
                  borderColor = "border-brand-primary";
                  Icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
                } else if (h.action === 'comment' || h.action === 'note') {
                  actionText = 'New update provided';
                  Icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
                } else if (h.action === 'assignment') {
                  actionText = 'Ticket reassigned';
                  Icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
                } else if (h.action === 'priority_change') {
                  actionText = 'Priority updated';
                  borderColor = "border-red-400";
                  iconColor = "text-red-500";
                  Icon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
                } else {
                  actionText = h.action.replace('_', ' ');
                  Icon = <div className="w-2.5 h-2.5 rounded-full bg-brand-ink-mute"></div>;
                }
                
                return (
                  <div key={i} className={`relative pl-8 group ${isLatest ? '' : 'opacity-80 hover:opacity-100 transition-opacity'}`}>
                    <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm ${bgColor} ${borderColor} ${iconColor}`}>
                      {Icon}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                      <p className={`text-sm font-semibold capitalize ${isLatest ? 'text-brand-ink' : 'text-brand-ink-secondary'}`}>{actionText}</p>
                      <p className="text-xs text-brand-ink-mute whitespace-nowrap mt-1 sm:mt-0 font-medium">
                        {new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {h.note && (
                      <div className="mt-2 p-3 bg-brand-canvas-soft border border-brand-hairline-cool rounded-lg shadow-sm text-sm text-brand-ink leading-relaxed">
                        {h.note}
                      </div>
                    )}
                    <p className="text-[11px] font-medium text-brand-ink-mute mt-2">
                      by {h.performed_by?.name || 'System Auto-Routing'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
