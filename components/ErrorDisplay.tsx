
import React from 'react';
import RestartButton from './RestartButton';

interface ErrorDisplayProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  error: string;
  onDismiss: () => void;
  startGameFlow: () => void;
  currentLanguage: 'en' | 'pt';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ t, error, onDismiss, startGameFlow }) => {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4 animate-fadeIn"
      style={{ 
        backgroundColor: 'var(--background-primary)', 
        color: 'var(--text-main)'
      }}
    >
      <div className="text-center bg-secondary p-8 rounded-lg shadow-xl border border-magical-dissonance-border max-w-lg">
        <h2 className="font-heading text-4xl text-magical-dissonance-text mb-4">{t("A Dissonant Chord!")}</h2>
        <p className="font-body text-lg mb-8">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onDismiss} className="fantasy-button fantasy-button-secondary">
            {t("Return to Safety")}
          </button>
          <RestartButton onRestart={startGameFlow} text={t("Restart Chronicle")} />
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
