import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-200 rounded-2xl m-4">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Template Rendering Error</h2>
          <p className="text-sm text-red-600 max-w-md">There was a critical error while rendering this section of the page. Please contact the administrator.</p>
        </div>
      );
    }
    return this.props.children;
  }
}