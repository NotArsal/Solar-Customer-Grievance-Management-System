import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  
  const [formData, setFormData] = useState({
    product_type: 'Solar Panel', category: '', subject: '', description: '', attachments: []
  });
  const [file, setFile] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || userData?.role !== 'customer') {
      navigate('/auth');
      return;
    }
    setUser(userData);
    fetchCategories();
    fetchMyTickets();
  }, [navigate]); // ignoring fetchCategories/fetchMyTickets in deps to prevent infinite loops unless wrapped in useCallback

  const fetchCategories = async () => {
    try {
      const res = await api.get('/v1/routing-categories');
      setCategories(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, category: res.data[0].name }));
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await api.get('/v1/complaints');
      setMyTickets(res.data);
    } catch (err) {
      toast.error('Failed to load my tickets');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentUrl = null;
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append('image', file);
        
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          imgFormData
        );
        attachmentUrl = imgbbRes.data.data.url;
      }

      const payload = { 
        ...formData,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone || 'N/A'
      };
      
      if (attachmentUrl) {
        payload.attachments = [attachmentUrl];
      }

      const res = await api.post('/v1/complaints', payload);
      setTicketId(res.data.ticket_id);
      toast.success('Complaint registered successfully!');
      fetchMyTickets(); // Refresh list
    } catch (err) {
      toast.error('Error creating complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTicketId(null);
    setFormData(prev => ({ ...prev, subject: '', description: '' }));
    setFile(null);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="card-feature-light">
          <h2 className="text-[36px] tracking-display-lg font-medium mb-2 text-brand-ink">Raise a Complaint</h2>
          <p className="text-brand-ink-mute text-sm mb-8">Please fill out the form below and our team will be instantly assigned.</p>
          
          {ticketId ? (
            <div className="p-6 bg-brand-canvas-soft rounded-md border border-brand-hairline-cool animate-fade-in">
              <h3 className="text-xl font-medium mb-2 text-brand-ink">Complaint Registered!</h3>
              <p className="text-sm text-brand-ink-mute">Your issue has been successfully submitted to our team.</p>
              <div className="mt-6 p-4 bg-brand-canvas shadow-level-1 rounded-md border border-brand-hairline">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-ink-mute mb-1">Your Ticket ID</p>
                <p className="text-[28px] tracking-display-md font-medium text-brand-ink">{ticketId}</p>
              </div>
              <button onClick={resetForm} className="mt-6 btn-secondary">File Another Issue</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-ink-mute mb-2">Product Type</label>
                  <select className="input-field" onChange={e => setFormData({...formData, product_type: e.target.value})} disabled={isSubmitting}>
                    <option>Solar Panel</option><option>Inverter</option><option>Battery</option><option>Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-ink-mute mb-2">Issue Category</label>
                  <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} disabled={isSubmitting}>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-2">Subject</label>
                <input required placeholder="E.g., Inverter showing red light" className="input-field" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} disabled={isSubmitting} />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-2">Description</label>
                <textarea required placeholder="Please provide detailed information..." rows="5" className="input-field resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} disabled={isSubmitting} />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-2">Attachment (Optional)</label>
                <input type="file" accept="image/*,video/*" className="input-field text-sm bg-brand-canvas-soft" onChange={e => setFile(e.target.files[0])} disabled={isSubmitting} />
              </div>
              
              <button type="submit" className="btn-primary w-full md:w-auto mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="card-feature-light px-6 py-6">
           <h3 className="text-lg font-medium mb-4 border-b border-brand-hairline-cool pb-2 text-brand-ink">My Tickets</h3>
           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
             {myTickets.length === 0 ? (
               <p className="text-sm text-brand-ink-mute text-center py-4">You have no active tickets.</p>
             ) : (
               myTickets.map(t => (
                 <div key={t._id} className="p-4 border border-brand-hairline rounded-md shadow-level-1 hover:bg-brand-canvas-soft cursor-pointer transition-colors" onClick={() => navigate('/track?id=' + t.ticket_id)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-brand-ink">{t.ticket_id}</span>
                      <span className="text-[10px] uppercase font-medium bg-brand-canvas-soft border border-brand-hairline-cool px-2 py-0.5 rounded-sm text-brand-ink-secondary">{t.status}</span>
                    </div>
                    <p className="text-sm font-medium truncate text-brand-ink-secondary">{t.subject}</p>
                    <div className="flex justify-between items-center mt-3 text-[10px] text-brand-ink-mute">
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                      <span className={`font-medium ${t.priority === 'High' || t.priority === 'Critical' ? 'text-red-600' : ''}`}>{t.priority}</span>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
