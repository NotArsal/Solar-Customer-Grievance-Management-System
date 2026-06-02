import { useState, useEffect } from 'react';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      if (user.role === 'customer') {
        navigate('/portal');
      } else {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const res = await api.post('/v1/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Successfully logged in!');
        navigate('/portal');
        window.location.reload();
      } else {
        const res = await api.post('/v1/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Account created successfully!');
        navigate('/portal');
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card-feature-light">
        <div className="text-center mb-8">
          <h2 className="text-[28px] tracking-display-md font-medium text-brand-ink">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-brand-ink-mute mt-2 text-sm">
            {isLogin ? 'Sign in to track your grievances' : 'Register to submit and track your issues'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Full Name</label>
                <input required className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Phone Number</label>
                <input required className="input-field" placeholder="1234567890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Email Address</label>
            <input required type="email" placeholder="john@example.com" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Password</label>
            <input required type="password" placeholder="••••••••" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-6 py-2.5 text-sm" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-brand-hairline-cool pt-6">
          <p className="text-sm text-brand-ink-mute">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', phone: '', password: '' });
              }} 
              className="font-medium text-brand-primary hover:text-brand-primary-deep transition-colors"
            >
              {isLogin ? "Register here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
