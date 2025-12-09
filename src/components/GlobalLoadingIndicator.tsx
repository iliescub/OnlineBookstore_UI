import React, { useState, useEffect } from 'react';
import { subscribeToLoading } from '../config/axios';

const GlobalLoadingIndicator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLoading(setIsLoading);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowMessage(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="bg-slate-800/95 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm">
          <div className="text-slate-200 font-medium">
            {showMessage ? 'Waking up server...' : 'Loading...'}
          </div>
          {showMessage && (
            <div className="text-slate-400 text-xs mt-0.5">
              This may take a moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator;
