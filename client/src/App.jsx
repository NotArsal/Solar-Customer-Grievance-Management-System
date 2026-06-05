import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './features/public/pages/Home';
import CustomerPortal from './features/customer/pages/CustomerPortal';
import TrackTicket from './features/customer/pages/TrackTicket';
import EmployeeDashboard from './features/employee/pages/EmployeeDashboard';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import Auth from './features/auth/pages/Auth';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';
import NotificationBell from './components/NotificationBell';
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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMobileMenuOpen(false);
    navigate('/');
    window.location.reload(); 
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col">
      <Toaster position="top-right" />
      <header className="bg-brand-canvas border-b border-brand-hairline sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-3 cursor-pointer" onClick={closeMobileMenu}>
            <div className="h-8 flex items-center justify-center">
              <img src="/company-logo.png" alt="Nature Tek Solar Logo" className="h-full w-auto object-contain" />
            </div>
            <span className="text-xl font-medium text-brand-ink tracking-tight hidden sm:block">Nature Tek Solar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center text-sm font-medium">
            <Link to="/portal" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Raise Complaint</Link>
            <Link to="/track" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Track Ticket</Link>
            {!token && <Link to="/auth" className="btn-primary ml-2">Login / Sign Up</Link>}
            {token && user?.role === 'employee' && <Link to="/employee" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Dashboard</Link>}
            {token && (user?.role === 'admin' || user?.role === 'superadmin') && <Link to="/admin" className="text-brand-ink-mute hover:text-brand-ink transition-colors">Admin</Link>}
            {token && <NotificationBell />}
            {token && <button onClick={handleLogout} className="text-brand-ink-mute hover:text-brand-ink">Logout</button>}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {token && <NotificationBell />}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-ink focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-brand-canvas border-b border-brand-hairline">
            <nav className="flex flex-col px-4 pt-2 pb-4 space-y-3 text-sm font-medium">
              <Link to="/portal" onClick={closeMobileMenu} className="block py-2 text-brand-ink hover:text-brand-primary">Raise Complaint</Link>
              <Link to="/track" onClick={closeMobileMenu} className="block py-2 text-brand-ink hover:text-brand-primary">Track Ticket</Link>
              {!token && <Link to="/auth" onClick={closeMobileMenu} className="block py-2 text-brand-primary font-bold">Login / Sign Up</Link>}
              {token && user?.role === 'employee' && <Link to="/employee" onClick={closeMobileMenu} className="block py-2 text-brand-ink hover:text-brand-primary">Dashboard</Link>}
              {token && (user?.role === 'admin' || user?.role === 'superadmin') && <Link to="/admin" onClick={closeMobileMenu} className="block py-2 text-brand-ink hover:text-brand-primary">Admin</Link>}
              {token && <button onClick={handleLogout} className="block w-full text-left py-2 text-brand-ink hover:text-brand-primary">Logout</button>}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-16">
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          
          <Route path="/portal" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerPortal />
            </ProtectedRoute>
          } />
          <Route path="/track" element={<TrackTicket />} />
          
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
