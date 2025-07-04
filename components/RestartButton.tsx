
import React from 'react';

interface RestartButtonProps {
  onRestart: () => void;
  disabled?: boolean;
  text?: string;
}

// Conceptual: In a real sound service, these would trigger actual audio.
const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const RestartButton: React.FC<RestartButtonProps> = ({ 
  onRestart, 
  disabled = false, 
  text = "Begin Your Quest" 
}) => {
  return (
    <button
      onClick={() => {
        soundService.playSound('BUTTON_CLICK_PRIMARY'); // Conceptual
        onRestart();
      }}
      className="fantasy-button fantasy-button-primary text-xl px-8 py-4"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RestartButton;
