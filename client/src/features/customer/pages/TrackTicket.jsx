import { useState } from 'react';
import api from '../../../config/axios';
import { getStatusColor } from '../../../utils/statusColors';

export default function TrackTicket() {
  const [ticketId, setTicketId] = useState('');
  const [data, setData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/v1/complaints/${ticketId}/track`);
      setData(res.data);
    } catch (err) {
      alert('Ticket not found');
      setData(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="premium-card">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
        <h2 className="text-3xl font-bold mb-2">Track Your Ticket</h2>
        <p className="text-brand-text mb-8">Enter your Ticket ID below to check the real-time status of your complaint.</p>
        
        <form onSubmit={handleTrack} className="flex space-x-4 mb-10">
          <input required placeholder="E.g., NTS-2026-00001" className="input-field shadow-sm" value={ticketId} onChange={e => setTicketId(e.target.value)} />
          <button type="submit" className="btn-primary whitespace-nowrap">Track Status</button>
        </form>

        {data && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 bg-brand-input rounded-md border border-gray-100 shadow-sm">
              <h3 className="font-bold text-xl border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 text-brand-primary dark:text-white">Ticket Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-brand-text dark:text-gray-300">
                <p><strong className="text-gray-900 dark:text-gray-100 block mb-1">Status</strong> <span className={`inline-block px-3 py-1 border shadow-sm rounded font-bold uppercase tracking-wide text-xs ${getStatusColor(data.complaint.status)}`}>{data.complaint.status}</span></p>
                <p><strong className="text-gray-900 dark:text-gray-100 block mb-1">Product</strong> {data.complaint.product_type}</p>
                <p className="col-span-2"><strong className="text-gray-900 block mb-1">Subject</strong> {data.complaint.subject}</p>
                <p className="col-span-2"><strong className="text-gray-900 block mb-1">Date Raised</strong> {new Date(data.complaint.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-brand-primary">Update History</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {data.history.map((h, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand-bg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-brand-primary font-bold">
                      {data.history.length - i}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-md shadow-sm bg-white border border-gray-100">
                      <time className="text-xs font-bold uppercase text-brand-secondary mb-1 block">{new Date(h.timestamp).toLocaleString()}</time>
                      <p className="font-semibold text-brand-primary mb-1">Status: {h.to_status}</p>
                      <p className="text-sm text-brand-text">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
