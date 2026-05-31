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

            <h4 className="text-sm font-medium text-brand-ink mb-4">Ticket History</h4>
            <div className="relative border-l-2 border-brand-hairline-cool ml-3 space-y-6">
              {history.map((h, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-canvas border-2 border-brand-primary rounded-full"></div>
                  <p className="text-sm font-medium text-brand-ink">{h.action}</p>
                  {h.details && <p className="text-sm text-brand-ink-mute mt-1">{h.details}</p>}
                  <p className="text-xs text-brand-ink-faint mt-1">{new Date(h.timestamp).toLocaleString()} by {h.actor?.name || 'System'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
