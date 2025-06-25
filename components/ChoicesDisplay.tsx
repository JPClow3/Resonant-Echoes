
import React from 'react';

interface ChoicesDisplayProps {
  choices: string[];
  onChoiceSelected: (choice: string, index: number) => void;
  isLoading?: boolean;
  lastChosenIndex?: number | null;
}

// Conceptual: In a real sound service, these would trigger actual audio.
const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const ChoicesDisplay: React.FC<ChoicesDisplayProps> = ({ choices, onChoiceSelected, isLoading, lastChosenIndex }) => {
  const isEchoWeavingChoice = (choiceText: string): boolean => {
    const keywords = ["echo", "weave", "attune", "synthesize", "resonate", "silence"];
    return keywords.some(keyword => choiceText.toLowerCase().includes(keyword));
  };

  return (
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => {
            soundService.playSound('BUTTON_CLICK'); // Conceptual
            onChoiceSelected(choice, index);
          }}
          onMouseEnter={() => soundService.playSound('CHOICE_HOVER')} // Conceptual
          className={`w-full fantasy-button fantasy-button-choice text-left block 
            ${isEchoWeavingChoice(choice) ? 'choice-echo-weaving-hint' : ''}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            ${lastChosenIndex === index ? 'chosen-button-feedback' : ''}
          `}
          disabled={isLoading}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ChoicesDisplay);
