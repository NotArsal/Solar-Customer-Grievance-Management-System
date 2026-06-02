import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Hero from './pages/Hero';
import CustomerPortal from './features/customer/pages/CustomerPortal';
import TrackTicket from './features/customer/pages/TrackTicket';
import EmployeeDashboard from './features/employee/pages/EmployeeDashboard';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import Login from './features/auth/pages/Login';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import CustomerAuth from './features/customer/pages/CustomerAuth';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
    <h2 className="text-[36px] tracking-display-lg font-medium text-brand-ink mb-2">404</h2>
    <p className="text-brand-ink-mute">The page you are looking for does not exist.</p>
    <Link to="/" className="btn-secondary mt-6">Go Home</Link>
  </div>
);

function MainApp() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.clear();
    // Dispatch a custom event to notify components if needed, or simply navigate
    navigate('/');
    // For immediate UI update of the header without context, we trigger a re-render
    window.location.reload(); // Fallback if no context
  };

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col">
      <Toaster position="top-right" />
      <header className="bg-brand-canvas border-b border-brand-hairline sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
              <img src="/company-logo.png" alt="Nature Tek Solar Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-medium text-brand-ink tracking-tight">Nature Tek Solar</span>
          </Link>
          <nav className="flex space-x-6 items-center text-sm font-medium">
            <Link to="/portal" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Raise Complaint</Link>
            <Link to="/track" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Track Ticket</Link>
            {!token && <Link to="/auth" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Customer Login</Link>}
            {!token && <Link to="/login" className="btn-primary ml-2">Staff Login</Link>}
            {token && user?.role === 'employee' && <Link to="/employee" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Dashboard</Link>}
            {token && (user?.role === 'admin' || user?.role === 'superadmin') && <Link to="/admin" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Admin</Link>}
            {token && <NotificationBell />}
            {token && <button onClick={handleLogout} className="text-brand-ink-mute hover:text-brand-ink">Logout</button>}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-16">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/portal" element={<CustomerPortal />} />
          <Route path="/auth" element={<CustomerAuth />} />
          <Route path="/track" element={<TrackTicket />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee', 'admin', 'superadmin']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
