import { useState } from 'react';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/v1/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'admin' || user.role === 'superadmin') navigate('/admin');
      else navigate('/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card-feature-light">
        <h2 className="text-[28px] tracking-display-md font-medium mb-6 text-brand-ink">Staff Authentication</h2>
        {error && <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-medium">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Employee Email</label>
            <input 
              type="email" 
              required 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-brand-ink-mute">
          <p>Authorized personnel only. Activities are monitored.</p>
        </div>
      </div>
    </div>
  );
}
