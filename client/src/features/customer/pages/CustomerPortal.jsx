import { useState, useEffect, useRef } from 'react';

import api from '../../../config/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';



export default function CustomerPortal() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [myTickets, setMyTickets] = useState([]);
  
  const [formData, setFormData] = useState({
    product_type: '', category: '', subject: '', description: '', attachments: []
  });
  const [file, setFile] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [productIssueMapping, setProductIssueMapping] = useState({});
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchMyTickets = async () => {
    try {
      const res = await api.get('/v1/complaints');
      setMyTickets(res.data.complaints || []);
    } catch {
      toast.error('Failed to load my tickets');
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/v1/routing-categories', {
        signal: abortControllerRef.current?.signal
      });
      const categories = res.data;
      const mapping = {};
      categories.forEach(cat => {
        if (!mapping[cat.assigned_department]) {
          mapping[cat.assigned_department] = [];
        }
        mapping[cat.assigned_department].push(cat.name);
      });
      setProductIssueMapping(mapping);
    } catch (err) {
      if (err.name !== 'CanceledError') {
        toast.error('Failed to load issue categories');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || userData?.role !== 'customer') {
      navigate('/auth');
      return;
    }
    setTimeout(() => {
      fetchMyTickets();
      fetchCategories();
    }, 0);
  }, [navigate]);




  const handleProductChange = (e) => {
    setFormData({
      ...formData,
      product_type: e.target.value,
      category: '' // Reset the issue category when product changes
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentUrl = null;
      if (file) {
        const base64Img = await new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = () => resolve(reader.result);
           reader.onerror = error => reject(error);
        });

        const uploadRes = await api.post('/v1/media/upload', 
          { image: base64Img },
          { signal: abortControllerRef.current?.signal }
        );
        attachmentUrl = uploadRes.data.data.url;
      }

      const generatedSubject = formData.description.length > 50 
        ? formData.description.substring(0, 47) + '...'
        : formData.description;

      const payload = { 
        ...formData,
        subject: generatedSubject || 'Issue Report',
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
              <div className="mt-6 p-4 bg-brand-canvas shadow-level-1 rounded-md border border-brand-hairline flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-ink-mute mb-1">Your Ticket ID</p>
                  <p className="text-[28px] tracking-display-md font-medium text-brand-ink">{ticketId}</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(ticketId); toast.success('Ticket ID copied to clipboard!'); }}
                  className="p-3 bg-brand-canvas-soft border border-brand-hairline hover:bg-brand-hairline-cool hover:text-brand-primary text-brand-ink-mute rounded-md transition-colors"
                  title="Copy Ticket ID"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <button onClick={resetForm} className="mt-6 btn-secondary">File Another Issue</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-ink-mute mb-2">Product Type</label>
                  <select 
                    className="input-field" 
                    value={formData.product_type} 
                    onChange={handleProductChange} 
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select a Product</option>
                    {Object.keys(productIssueMapping).map(product => (
                      <option key={product} value={product}>{product}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-ink-mute mb-2">Issue Category</label>
                  <select 
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    disabled={!formData.product_type || isSubmitting}
                    required
                  >
                    <option value="">
                      {formData.product_type ? "Select the specific issue" : "Select a product first"}
                    </option>
                    {formData.product_type && productIssueMapping[formData.product_type].map(issue => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                </div>
              </div>


              
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-2">Description</label>
                <textarea required placeholder="Please provide detailed information..." rows="5" className="input-field resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} disabled={isSubmitting} />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-2">Attachment (Optional)</label>
                <input type="file" accept="image/*" className="input-field text-sm bg-brand-canvas-soft" onChange={e => setFile(e.target.files[0])} disabled={isSubmitting} />
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
             {isLoadingTickets ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                </div>
             ) : myTickets.length === 0 ? (
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
