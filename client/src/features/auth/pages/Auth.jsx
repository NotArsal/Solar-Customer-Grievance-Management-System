import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../config/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Unified login - the backend returns the user role
        const res = await api.post('/v1/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}`);
        
        // Redirect based on role
        if (res.data.user.role === 'admin' || res.data.user.role === 'superadmin') {
          navigate('/admin');
        } else if (res.data.user.role === 'employee') {
          navigate('/employee');
        } else {
          // If they came from a specific page (like /portal), send them back there, else default to /portal
          const from = location.state?.from?.pathname || '/portal';
          navigate(from, { replace: true });
        }
      } else {
        // Customer Signup
        const res = await api.post('/v1/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Account created successfully!');
        navigate('/portal');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-brand-canvas/80 backdrop-blur-md rounded-xl shadow-level-2 border border-brand-hairline p-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/company-logo.png" alt="Logo" className="h-full w-auto object-contain" />
          </div>
        </div>

        <h2 className="text-[28px] tracking-display-md font-medium text-center text-brand-ink mb-2">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-center text-brand-ink-mute text-sm mb-8">
          {isLogin ? 'Sign in to manage your tickets and services.' : 'Join us to get seamless solar support.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="input-field" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ink-mute mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="input-field" 
                  placeholder="+1 234 567 8900"
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="input-field" 
              placeholder="you@example.com"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-ink-mute mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="input-field" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full btn-primary py-3 mt-4 flex justify-center items-center transition-all"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-brand-hairline pt-6">
          <p className="text-sm text-brand-ink-secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              onClick={handleToggle} 
              className="ml-2 font-medium text-brand-primary hover:text-brand-primary-deep transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
