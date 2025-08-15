

import React from 'react';
import InteractiveText from './InteractiveText'; // Assuming InteractiveText is in the same folder

interface StoryDisplayProps {
  storyText: string;
  enableTypingEffect?: boolean;
  className?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyText, enableTypingEffect = false, className = "" }) => {
  return (
    <div className={`animate-fadeInUp-story illuminated-first-letter ${className}`}>
      <InteractiveText text={storyText} enableTypingEffect={enableTypingEffect} />
    </div>
  );
};

export default StoryDisplay;