
import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
  t?: (key: string) => string; // Optional t function for translation
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, message, t }) => {
  if (!isLoading) {
    return null;
  }

  const defaultMessageKey = "The Weave Shimmers...";
  const displayMessage = message || (t ? t(defaultMessageKey) : defaultMessageKey);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50 animate-fadeIn"
      style={{ 
        backgroundColor: 'var(--background-primary)', 
        color: 'var(--text-main)'
      }}
    >
      <div 
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
        style={{ borderColor: 'var(--accent-primary)' }}
      ></div>
      <p className="font-body text-xl mt-4 loading-indicator-text">{displayMessage}</p>
    </div>
  );
};

export default React.memo(LoadingIndicator);
