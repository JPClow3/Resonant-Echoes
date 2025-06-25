
import React, { useState, useEffect, useRef } from 'react';
import InteractiveText from './InteractiveText';

interface LoreInterpretationModalProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  loreTitle: string;
  interpretations: string[];
  onSubmit: (interpretation: string) => void;
  onCancel: () => void;
}

const LoreInterpretationModal: React.FC<LoreInterpretationModalProps> = ({ 
    t,
    loreTitle, 
    interpretations, 
    onSubmit, 
    onCancel 
}) => {
  const [selectedInterpretation, setSelectedInterpretation] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    if (interpretations.length > 0) {
        setSelectedInterpretation(interpretations[0]); 
    }
  }, [interpretations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterpretation) {
      onSubmit(selectedInterpretation);
    }
  };

  return (
    <div 
        ref={modalRef}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lore-interpretation-legend"
        tabIndex={-1}
    >
      <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg shadow-xl text-main-color w-full max-w-lg">
        <fieldset>
            <legend id="lore-interpretation-legend" className="font-heading text-2xl text-heading-color mb-3 text-center echoic-unveil-title w-full">
                {t("Interpret the Ancient Lore")}
                <p className="font-body text-base mt-1 normal-case">
                    {t("The meaning of \"{title}\" is veiled. How do you understand its truth?", { title: loreTitle })}
                </p>
            </legend>
            
            <div className="my-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {interpretations.map((interp, index) => (
                    <label 
                        key={index} 
                        className={`block p-3 rounded-md border-2 cursor-pointer transition-all duration-200
                                    ${selectedInterpretation === interp ? 'border-accent-primary bg-primary shadow-md scale-105' : 'border-divider-color hover:border-accent-secondary bg-primary opacity-80 hover:opacity-100'}`}
                    >
                        <input
                            type="radio"
                            name="loreInterpretation"
                            value={interp}
                            checked={selectedInterpretation === interp}
                            onChange={() => setSelectedInterpretation(interp)}
                            className="sr-only" 
                            aria-labelledby={`interp-text-${index}`}
                        />
                        <InteractiveText text={interp} className="text-sm" id={`interp-text-${index}`} />
                    </label>
                ))}
            </div>
        </fieldset>

        <div className="flex gap-4 mt-5">
            <button 
                type="button" 
                onClick={onCancel} 
                className="fantasy-button fantasy-button-secondary flex-1"
            >
                {t("Ponder Later")}
            </button>
            <button 
                type="submit" 
                className="fantasy-button fantasy-button-primary flex-1"
                disabled={!selectedInterpretation}
            >
                {t("This is My Understanding")}
            </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(LoreInterpretationModal);
