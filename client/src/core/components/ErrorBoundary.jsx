import React from 'react';
import { sendTelemetry } from '../utils/telemetry';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error telemetry
    sendTelemetry('react_error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      url: window.location.href,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-brand-canvas-soft flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-level-2 border border-red-200 p-8 max-w-xl w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-brand-ink mb-2">Something went wrong</h2>
            <p className="text-brand-ink-faint mb-6">
              An unexpected error occurred in the application. We have been notified and are looking into it.
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <details className="whitespace-pre-wrap text-sm text-red-800 bg-red-50 p-4 rounded-lg overflow-auto mb-6 max-h-64">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-dark transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
