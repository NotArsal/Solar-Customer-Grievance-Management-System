import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerPortal from './features/customer/pages/CustomerPortal';
import TrackTicket from './features/customer/pages/TrackTicket';
import EmployeeDashboard from './features/employee/pages/EmployeeDashboard';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import Login from './features/auth/pages/Login';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img src="/company-logo.png" alt="Nature Tek Solar Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-brand-primary dark:text-white tracking-tight">Nature Tek Solar</span>
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-secondary dark:text-gray-400">Support Portal</span>
              </div>
            </div>
            <nav className="flex space-x-8 items-center">
              <Link to="/" className="text-brand-text dark:text-gray-300 hover:text-brand-primary dark:hover:text-white font-semibold transition-colors duration-200">Raise Complaint</Link>
              <Link to="/track" className="text-brand-text dark:text-gray-300 hover:text-brand-primary dark:hover:text-white font-semibold transition-colors duration-200">Track Ticket</Link>
              <Link to="/login" className="text-brand-text dark:text-gray-300 hover:text-brand-primary dark:hover:text-white font-semibold transition-colors duration-200">Staff Login</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<CustomerPortal />} />
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
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-brand-secondary dark:text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Nature Tek Solar Pvt. Ltd. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
