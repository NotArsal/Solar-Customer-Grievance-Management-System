import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerPortal from './pages/CustomerPortal';
import TrackTicket from './pages/TrackTicket';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-brand-primary rounded-md flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">N</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-brand-primary tracking-tight">Nature Tek Solar</span>
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-secondary">Support Portal</span>
              </div>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-brand-text hover:text-brand-primary font-semibold transition-colors duration-200">Raise Complaint</Link>
              <Link to="/track" className="text-brand-text hover:text-brand-primary font-semibold transition-colors duration-200">Track Ticket</Link>
              <Link to="/login" className="text-brand-text hover:text-brand-primary font-semibold transition-colors duration-200">Staff Login</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<CustomerPortal />} />
            <Route path="/track" element={<TrackTicket />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-brand-secondary font-medium">
            &copy; {new Date().getFullYear()} Nature Tek Solar Pvt. Ltd. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
