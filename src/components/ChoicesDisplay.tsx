
import React, { useState, useEffect } from 'react';
import { EchoHotspot } from '../types'; 

interface ChoicesDisplayProps {
  choices: string[];
  onChoiceSelected: (choice: string, index: number) => void;
  isLoading?: boolean;
  isTransitioning?: boolean;
  lastChosenIndex?: number | null;
  activeHotspots?: EchoHotspot[]; // Optional: For styling hotspot-related choices
  playSound?: (sound: 'CHOICE_HOVER' | 'CHOICE_SELECTED') => void; // Make sound playing a prop
}

const ChoicesDisplay: React.FC<ChoicesDisplayProps> = ({ 
  choices, 
  onChoiceSelected, 
  isLoading,
  isTransitioning,
  lastChosenIndex,
  activeHotspots,
  playSound
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When the parent signals loading is complete, re-enable buttons.
  useEffect(() => {
    if (!isLoading) {
      setIsSubmitting(false);
    }
  }, [isLoading]);


  const handleChoiceClick = (choice: string, index: number) => {
    if (isSubmitting) return; // Prevent multiple clicks
    setIsSubmitting(true); // Disable buttons immediately on click
    if (playSound) playSound('CHOICE_SELECTED');
    onChoiceSelected(choice, index);
  };

  const getChoiceStyling = (choiceText: string): string => {
    let classes = "";
    // Check for Echo Weaving keywords
    const echoWeavingKeywords = ["echo", "weave", "attune", "synthesize", "resonate", "silence", "focus senses", "surge"];
    if (echoWeavingKeywords.some(keyword => choiceText.toLowerCase().includes(keyword))) {
      classes += ' choice-echo-weaving-hint';
    }

    // Check if the choice is related to an active hotspot
    if (activeHotspots && activeHotspots.length > 0) {
      const hotspotChoiceMatch = choiceText.match(/^([a-zA-Z0-9_]+):(.*)$/);
      if (hotspotChoiceMatch) {
        const hotspotId = hotspotChoiceMatch[1];
        if (activeHotspots.some(h => h.id === hotspotId)) {
          classes += ' choice-echo-hotspot-hint';
        }
      }
    }
    return classes;
  };
  
  const getDisplayChoiceText = (choiceText: string): string => {
    const hotspotChoiceMatch = choiceText.match(/^([a-zA-Z0-9_]+):(.*)$/);
    if (hotspotChoiceMatch && hotspotChoiceMatch[2]) {
        return hotspotChoiceMatch[2].trim();
    }
    return choiceText;
  }

  return (
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => handleChoiceClick(choice, index)}
          onMouseEnter={() => {
            if(playSound) playSound('CHOICE_HOVER');
          }}
          className={`w-full fantasy-button fantasy-button-choice text-left block 
            ${getChoiceStyling(choice)}
            ${(isLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}
            ${lastChosenIndex === index ? 'chosen-button-feedback' : ''}
            ${isTransitioning && lastChosenIndex !== index ? 'opacity-0' : 'opacity-100'}
          `}
          disabled={isLoading || isSubmitting}
        >
          {getDisplayChoiceText(choice)}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ChoicesDisplay);
