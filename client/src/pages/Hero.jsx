import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="w-20 h-20 mb-8 overflow-hidden rounded-full border-4 border-brand-canvas shadow-level-1">
        <img src="/company-logo.png" alt="Nature Tek Solar Logo" className="w-full h-full object-cover" />
      </div>
      
      <h1 className="text-[48px] md:text-[64px] tracking-display-xl font-medium text-brand-ink leading-tight mb-6 max-w-4xl">
        Seamless <span className="text-brand-primary-deep">Solar</span> Grievance Management
      </h1>
      
      <p className="text-lg md:text-xl text-brand-ink-mute mb-12 max-w-2xl font-light">
        Experience industry-leading support. Report issues, track tickets in real-time, and get your solar energy systems back on track faster than ever.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link to="/portal" className="btn-primary text-lg px-8 py-4 shadow-lg hover:-translate-y-1 transition-transform">
          Report an Issue
        </Link>
        <Link to="/track" className="btn-secondary text-lg px-8 py-4 bg-brand-canvas-soft hover:bg-brand-canvas transition-colors">
          Track Ticket Status
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
        <div className="card-feature-light hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 bg-brand-canvas border border-brand-hairline rounded-md flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-brand-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-medium text-brand-ink mb-2">Fast Resolution</h3>
          <p className="text-sm text-brand-ink-mute">Our automated SLA tracking ensures your issues are routed to the right expert immediately.</p>
        </div>
        
        <div className="card-feature-light hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 bg-brand-canvas border border-brand-hairline rounded-md flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-brand-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-medium text-brand-ink mb-2">Real-time Tracking</h3>
          <p className="text-sm text-brand-ink-mute">Monitor your ticket's progress every step of the way with our transparent timeline.</p>
        </div>

        <div className="card-feature-light hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 bg-brand-canvas border border-brand-hairline rounded-md flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-brand-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="font-medium text-brand-ink mb-2">Enterprise Support</h3>
          <p className="text-sm text-brand-ink-mute">Dedicated dashboards for our service teams to prioritize critical operations.</p>
        </div>
      </div>
    </div>
  );
}
