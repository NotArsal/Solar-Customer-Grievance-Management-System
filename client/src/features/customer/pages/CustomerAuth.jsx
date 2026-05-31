import { useState } from 'react';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post('/v1/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        const res = await api.post('/v1/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card-feature-light">
        <h2 className="text-[28px] tracking-display-md font-medium mb-6 text-brand-ink">
          {isLogin ? 'Customer Login' : 'Register Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Full Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Phone Number</label>
                <input required className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Email Address</label>
            <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Password</label>
            <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-medium text-brand-ink-mute hover:text-brand-ink transition-colors underline underline-offset-2">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
