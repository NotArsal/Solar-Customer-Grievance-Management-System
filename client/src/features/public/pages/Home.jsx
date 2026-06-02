import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative overflow-hidden flex flex-col justify-center items-center min-h-[75vh] animate-fade-in px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-canvas via-brand-canvas-soft to-[#e8f5e9] opacity-50 z-[-1]" />
      
      <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary-deep text-xs font-semibold tracking-wide uppercase border border-brand-primary/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></span>
            Live Support Active
          </div>
          
          <h1 className="text-[44px] md:text-[56px] leading-[1.1] tracking-display-lg font-medium text-brand-ink">
            Seamless Solar Support &amp; <span className="text-brand-primary">Grievance Resolution</span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-ink-mute max-w-lg leading-relaxed font-light">
            Experience uninterrupted clean energy. Raise, track, and resolve your solar panel and inverter issues in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 w-full sm:w-auto">
            <Link to="/auth" className="btn-primary text-center py-3 px-8 text-base shadow-level-2 hover:-translate-y-0.5 transition-transform">
              Report an Issue
            </Link>
            <Link to="/track" className="btn-secondary text-center py-3 px-8 text-base bg-transparent border-2 hover:bg-brand-canvas-soft transition-colors">
              Track a Ticket
            </Link>
          </div>
        </div>

        {/* Right: Graphic / Placeholder */}
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-level-3 border border-brand-hairline bg-white/40 backdrop-blur-xl flex items-center justify-center group">
          {/* Decorative background blur behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/20 blur-[80px] rounded-full z-0 pointer-events-none group-hover:bg-brand-primary/30 transition-all duration-700"></div>
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-yellow-400/20 blur-[60px] rounded-full z-0 pointer-events-none"></div>

          <div className="relative z-10 w-[80%] h-[70%] border border-brand-hairline-cool bg-white rounded-xl shadow-level-1 overflow-hidden flex flex-col transition-transform duration-500 group-hover:scale-105">
            {/* Fake UI Header */}
            <div className="h-10 border-b border-brand-hairline-cool bg-brand-canvas-soft flex items-center px-4 space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            {/* Fake UI Content */}
            <div className="flex-1 p-6 space-y-4">
              <div className="h-4 w-1/3 bg-brand-hairline rounded-md"></div>
              <div className="h-24 w-full bg-brand-canvas-soft rounded-lg border border-brand-hairline-cool flex items-center justify-center text-brand-ink-faint text-sm">
                Dashboard Preview
              </div>
              <div className="flex space-x-4">
                <div className="h-20 flex-1 bg-brand-primary/10 rounded-lg border border-brand-primary/20"></div>
                <div className="h-20 flex-1 bg-brand-canvas-soft rounded-lg border border-brand-hairline-cool"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
