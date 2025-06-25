
import React, { useState, useEffect } from 'react';
import InteractiveText from './InteractiveText';

interface DreamRumorDisplayProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  dreamOrVision: string | null;
  rumors: string[];
  onDismissDream: () => void;
}

const DreamRumorDisplay: React.FC<DreamRumorDisplayProps> = ({ t, dreamOrVision, rumors, onDismissDream }) => {
  const [showDream, setShowDream] = useState(false);
  const [visibleRumors, setVisibleRumors] = useState<string[]>([]);

  useEffect(() => {
    if (dreamOrVision) {
      setShowDream(true);
    }
  }, [dreamOrVision]);

  useEffect(() => {
    // Show latest 1-2 rumors, older ones fade
    if (rumors.length > 0) {
        setVisibleRumors(rumors.slice(-2)); // Show last two rumors
    }
  }, [rumors]);

  const handleDismissDream = () => {
    setShowDream(false);
    onDismissDream();
  };

  return (
    <>
      {/* Dream/Vision Modal */}
      {showDream && dreamOrVision && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={handleDismissDream}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dream-vision-title"
        >
          <div 
            className="bg-secondary p-6 rounded-lg shadow-xl text-main-color w-full max-w-md border-2 border-magical-dissonance"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="dream-vision-title" className="font-heading text-2xl text-magical-dissonance mb-3 text-center">
              {t("A Fleeting Vision...")}
            </h3>
            <div className="font-body italic text-center mb-4 text-lg">
              <InteractiveText text={dreamOrVision} />
            </div>
            <button 
                onClick={handleDismissDream} 
                className="fantasy-button fantasy-button-secondary w-full"
            >
                {t("Dismiss")}
            </button>
          </div>
        </div>
      )}

      {/* Rumors Display - more subtle, perhaps as toast-like notifications or a small corner box */}
      {visibleRumors.length > 0 && (
        <div className="fixed bottom-4 right-4 w-full max-w-xs z-30 space-y-2">
          {visibleRumors.map((rumor, index) => (
            <div 
              key={index} 
              className="bg-primary p-3 rounded-md shadow-lg border border-divider-color animate-fadeInUp-story text-xs text-muted-color"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <strong className="text-accent-primary block mb-0.5">{t("Whispers in the Weave:")}</strong>
              <InteractiveText text={rumor} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default React.memo(DreamRumorDisplay);
