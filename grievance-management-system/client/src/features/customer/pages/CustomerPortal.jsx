import { useState } from 'react';
import axios from 'axios';
import api from '../../../config/axios';


export default function CustomerPortal() {
  const [formData, setFormData] = useState({
    customer_name: '', customer_phone: '', customer_email: '', product_type: 'Solar Panel', category: 'Product Defect', subject: '', description: '', attachments: []
  });
  const [file, setFile] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentUrl = null;
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append('image', file);
        
        const imgbbRes = await axios.post(
          'https://api.imgbb.com/1/upload?key=30abce10cd582f4e4c62e89a27e2c38c',
          imgFormData
        );
        attachmentUrl = imgbbRes.data.data.url;
      }

      const payload = { ...formData };
      if (attachmentUrl) {
        payload.attachments = [attachmentUrl];
      }

      const res = await api.post('/v1/complaints', payload);
      setTicketId(res.data.ticket_id);
    } catch (err) {
      alert('Error creating complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="premium-card">
        {/* Subtle decorative gradient top bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
        
        <h2 className="text-3xl font-bold mb-2">Raise a Complaint</h2>
        <p className="text-brand-text mb-8">Please fill out the form below and we will get back to you shortly.</p>
        
        {ticketId ? (
          <div className="p-6 bg-brand-input text-brand-primary rounded-md border-l-4 border-brand-primary animate-fade-in">
            <h3 className="font-heading text-2xl mb-2">Complaint Registered!</h3>
            <p className="text-brand-text">Your issue has been successfully submitted to our team.</p>
            <div className="mt-6 p-4 bg-white shadow-sm rounded-md border border-gray-100">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Your Ticket ID</p>
              <p className="font-bold text-3xl tracking-widest text-brand-primary">{ticketId}</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">Please keep this ID to track your complaint status.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required placeholder="Full Name" className="input-field" onChange={e => setFormData({...formData, customer_name: e.target.value})} disabled={isSubmitting} />
              <input required placeholder="Mobile Number" className="input-field" onChange={e => setFormData({...formData, customer_phone: e.target.value})} disabled={isSubmitting} />
            </div>
            
            <input required type="email" placeholder="Email Address" className="input-field" onChange={e => setFormData({...formData, customer_email: e.target.value})} disabled={isSubmitting} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Product Type</label>
                <select className="input-field cursor-pointer" onChange={e => setFormData({...formData, product_type: e.target.value})} disabled={isSubmitting}>
                  <option>Solar Panel</option><option>Inverter</option><option>Battery</option><option>Service</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Issue Category</label>
                <select className="input-field cursor-pointer" onChange={e => setFormData({...formData, category: e.target.value})} disabled={isSubmitting}>
                  <option>Product Defect</option><option>Installation Issue</option><option>Service Delay</option><option>Billing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Subject</label>
              <input required placeholder="E.g., Inverter showing red light" className="input-field" onChange={e => setFormData({...formData, subject: e.target.value})} disabled={isSubmitting} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Description</label>
              <textarea required placeholder="Please provide detailed information..." rows="5" className="input-field resize-none" onChange={e => setFormData({...formData, description: e.target.value})} disabled={isSubmitting} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Attachment (Optional Photo/Video)</label>
              <input type="file" accept="image/*,video/*" className="input-field text-sm" onChange={e => setFile(e.target.files[0])} disabled={isSubmitting} />
            </div>
            
            <button type="submit" className="btn-primary w-full md:w-auto md:px-12 mt-4 text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
