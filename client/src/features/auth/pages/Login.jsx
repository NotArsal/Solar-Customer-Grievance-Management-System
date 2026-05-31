import { useState } from 'react';
import api from '../../../config/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/v1/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'admin') navigate('/admin');
      else navigate('/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="premium-card">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
        <h2 className="text-3xl font-bold mb-6 text-brand-primary">Staff Portal</h2>
        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded border border-red-200 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Email</label>
            <input required type="email" placeholder="staff@natureteksolar.com" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Password</label>
            <input required type="password" placeholder="••••••••" className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">Sign In</button>
        </form>
      </div>
    </div>
  );
}
