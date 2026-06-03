import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white">Something went wrong</h3>
            <p className="text-sm text-surface-200/50">An unexpected error occurred in this section of the application.</p>
            <button onClick={() => window.location.reload()} className="btn-primary !py-2">Reload Page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
