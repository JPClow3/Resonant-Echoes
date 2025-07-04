
import React from 'react';
import { EchoHotspot } from '../types'; // Adjust path if necessary

interface ChoicesDisplayProps {
  choices: string[];
  onChoiceSelected: (choice: string, index: number) => void;
  isLoading?: boolean;
  lastChosenIndex?: number | null;
  activeHotspots?: EchoHotspot[]; // Optional: For styling hotspot-related choices
}

// Conceptual: In a real sound service, these would trigger actual audio.
const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const ChoicesDisplay: React.FC<ChoicesDisplayProps> = ({ 
  choices, 
  onChoiceSelected, 
  isLoading, 
  lastChosenIndex,
  activeHotspots 
}) => {

  const getChoiceStyling = (choiceText: string): string => {
    let classes = "";
    // Check for Echo Weaving keywords
    const echoWeavingKeywords = ["echo", "weave", "attune", "synthesize", "resonate", "silence", "focus senses", "surge"];
    if (echoWeavingKeywords.some(keyword => choiceText.toLowerCase().includes(keyword))) {
      classes += ' choice-echo-weaving-hint';
    }

    // Check if the choice is related to an active hotspot
    // This relies on a convention: AI prepends "hotspotId: " to the choice text.
    if (activeHotspots && activeHotspots.length > 0) {
      const hotspotChoiceMatch = choiceText.match(/^([a-zA-Z0-9_]+):(.*)$/);
      if (hotspotChoiceMatch) {
        const hotspotId = hotspotChoiceMatch[1];
        if (activeHotspots.some(h => h.id === hotspotId)) {
          // Add a distinct style for hotspot choices, e.g., a different border or subtle glow.
          // For now, let's reuse the echo weaving hint style, or define a new one in index.html if needed.
          classes += ' choice-echo-hotspot-hint'; // You'd define .choice-echo-hotspot-hint in CSS
        }
      }
    }
    return classes;
  };
  
  const getDisplayChoiceText = (choiceText: string): string => {
    // If it's a hotspot choice with "hotspotId:Choice Text", only display "Choice Text"
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
          onClick={() => {
            soundService.playSound('BUTTON_CLICK'); 
            onChoiceSelected(choice, index); // Send original choice text (with ID if hotspot)
          }}
          onMouseEnter={() => soundService.playSound('CHOICE_HOVER')} 
          className={`w-full fantasy-button fantasy-button-choice text-left block 
            ${getChoiceStyling(choice)}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            ${lastChosenIndex === index ? 'chosen-button-feedback' : ''}
          `}
          disabled={isLoading}
        >
          {getDisplayChoiceText(choice)}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ChoicesDisplay);
