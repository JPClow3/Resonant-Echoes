

import React from 'react';
import InteractiveText from './InteractiveText'; // Assuming InteractiveText is in the same folder

interface StoryDisplayProps {
  storyText: string;
  isStreaming?: boolean;
  className?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyText, isStreaming = false, className = "" }) => {
  return (
    <div className={`animate-fadeInUp-story illuminated-first-letter ${className}`}>
      <InteractiveText text={storyText} isStreaming={isStreaming} />
    </div>
  );
};

export default StoryDisplay;
