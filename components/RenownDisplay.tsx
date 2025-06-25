
import React from 'react';

interface RenownDisplayProps {
  renown: number;
  lastChangeNarrative: string | null;
  animateOnUpdate?: boolean; // To trigger animation if renown/narrative changes
}

const RenownDisplay: React.FC<RenownDisplayProps> = ({ renown, lastChangeNarrative, animateOnUpdate }) => {

  return (
    <div className="p-3 bg-secondary rounded-lg shadow border border-divider-color text-center">
      <h3 className="font-heading text-lg text-heading-color mb-1">Player Status</h3>
      <p className="font-body text-sm text-main-color">
        <strong>Renown:</strong> 
        <span key={`renown-${renown}`} className={animateOnUpdate ? "animate-subtle-shine" : ""}>
          {` ${renown}`}
        </span>
      </p>
      {lastChangeNarrative && (
        <p 
          key={`narrative-${lastChangeNarrative}`} 
          className={`font-body text-xs text-muted-color italic mt-1 ${animateOnUpdate ? "animate-fadeInUp-story" : ""}`}
        >
          {lastChangeNarrative}
        </p>
      )}
    </div>
  );
};

export default React.memo(RenownDisplay);
