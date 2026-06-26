import { useState, useEffect } from 'react';

export default function SlaTimer({ dueAt, isBreached, status }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // If ticket is resolved, closed, or already breached, stop timer
    if (isBreached || ['resolved', 'unresolved', 'closed'].includes(status)) {
      return;
    }

    if (!dueAt) return;

    const calculateTimeLeft = () => {
      const difference = new Date(dueAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('0h 0m remaining');
        return;
      }
      
      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };

    calculateTimeLeft(); // initial call
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute

    return () => clearInterval(timer);
  }, [dueAt, isBreached, status]);

  if (['resolved', 'unresolved', 'closed'].includes(status)) {
    return <span className="text-brand-ink-faint text-xs font-medium">-</span>;
  }

  if (isBreached || (timeLeft === '0h 0m remaining')) {
    return (
      <span className="text-red-600 font-medium px-2 py-1 bg-red-50 rounded-sm border border-red-200 text-[10px] uppercase inline-flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Breached
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <span className="text-brand-primary-deep px-2 py-1 bg-brand-canvas rounded-sm border border-brand-hairline text-[10px] uppercase font-medium inline-block w-max">
        On Track
      </span>
      {timeLeft && (
        <span className="text-[10px] font-mono text-brand-ink-mute flex items-center w-max mt-1">
          <svg className="w-3 h-3 mr-1 animate-pulse text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeLeft}
        </span>
      )}
    </div>
  );
}
