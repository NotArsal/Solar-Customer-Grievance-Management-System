import { useState } from 'react';
import axios from 'axios';

export default function CustomerPortal() {
  const [formData, setFormData] = useState({
    customer_name: '', customer_phone: '', customer_email: '', product_type: 'Solar Panel', category: 'Product Defect', subject: '', description: ''
  });
  const [ticketId, setTicketId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/v1/complaints', formData);
      setTicketId(res.data.ticket_id);
    } catch (err) {
      alert('Error creating complaint');
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
              <input required placeholder="Full Name" className="input-field" onChange={e => setFormData({...formData, customer_name: e.target.value})} />
              <input required placeholder="Mobile Number" className="input-field" onChange={e => setFormData({...formData, customer_phone: e.target.value})} />
            </div>
            
            <input required type="email" placeholder="Email Address" className="input-field" onChange={e => setFormData({...formData, customer_email: e.target.value})} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Product Type</label>
                <select className="input-field cursor-pointer" onChange={e => setFormData({...formData, product_type: e.target.value})}>
                  <option>Solar Panel</option><option>Inverter</option><option>Battery</option><option>Service</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Issue Category</label>
                <select className="input-field cursor-pointer" onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Product Defect</option><option>Installation Issue</option><option>Service Delay</option><option>Billing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Subject</label>
              <input required placeholder="E.g., Inverter showing red light" className="input-field" onChange={e => setFormData({...formData, subject: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Description</label>
              <textarea required placeholder="Please provide detailed information..." rows="5" className="input-field resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <button type="submit" className="btn-primary w-full md:w-auto md:px-12 mt-4 text-lg">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
