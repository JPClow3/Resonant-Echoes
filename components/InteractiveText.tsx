
import React from 'react';

interface InteractiveTextProps {
  text: string;
  className?: string;
  enableTypingEffect?: boolean; 
  id?: string; // Added id prop
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ text, className = "", enableTypingEffect = false, id }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }
    if (enableTypingEffect) {
      setDisplayedText(''); // Start with empty text for typing effect
      setCurrentIndex(0);   // Reset index
      
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex < text.length - 1) { // Check if there are more characters to type
            return prevIndex + 1;
          } else {
            clearInterval(intervalId); // All characters typed
            return text.length -1; // Keep index at max
          }
        });
      }, 20); // Adjust typing speed here (milliseconds)
      return () => clearInterval(intervalId); // Cleanup interval on unmount or text change
    } else {
      setDisplayedText(text); // No typing effect, show all text immediately
      setCurrentIndex(text.length -1); // Set index to end
    }
  }, [text, enableTypingEffect]);

  React.useEffect(() => {
    if (enableTypingEffect && text) { // Ensure text is not empty
        // Display text up to the current index
        setDisplayedText(text.substring(0, currentIndex + 1));
    } else if (!enableTypingEffect) {
        setDisplayedText(text); // If typing effect is off, ensure full text is displayed
    }
  }, [currentIndex, text, enableTypingEffect]);


  if (!displayedText && !text && !enableTypingEffect) { // If no text and no typing effect, render empty
    return <p id={id} className={`${className} leading-relaxed whitespace-pre-wrap`}></p>;
  }
  
  // Use displayedText if typing, otherwise full text
  const currentTextToParse = enableTypingEffect ? displayedText : text;

  const parts = [];
  let lastIndex = 0;
  // Regex to find <lore-keyword tip="tooltip">...</lore-keyword> and <tone style="...">...</tone>
  const tagRegex = /<(lore-keyword)\s+tip="([^"]*)">(.*?)<\/\1>|<(tone)\s+style=['"]([^['"]+)['"]>(.*?)<\/\4>/g;

  let match;
  // Ensure currentTextToParse is not null or undefined before exec
  if (currentTextToParse) {
    while ((match = tagRegex.exec(currentTextToParse)) !== null) {
      // Text before the tag
      if (match.index > lastIndex) {
        parts.push(currentTextToParse.substring(lastIndex, match.index));
      }

      if (match[1] === 'lore-keyword') { // Matched <lore-keyword tip="...">
        const tipText = match[2];
        const keywordText = match[3];
        parts.push(
          // Key will be assigned in the final map
          <span
            className="lore-keyword"
          >
            {keywordText}
            <span className="tooltip-text">{tipText}</span>
          </span>
        );
      } else if (match[4] === 'tone') { // Matched <tone style="...">
        const toneStyleName = match[5];
        const toneText = match[6];
        parts.push(
          // Key will be assigned in the final map
          <span className={`tone-${toneStyleName.toLowerCase()}`}>
            {toneText}
          </span>
        );
      }
      lastIndex = tagRegex.lastIndex;
    }
  }
  

  // Remaining text after the last tag
  if (currentTextToParse && lastIndex < currentTextToParse.length) {
    parts.push(currentTextToParse.substring(lastIndex));
  }

  return (
    <div id={id} className={`${className} leading-relaxed whitespace-pre-wrap`}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </div>
  );
};

export default InteractiveText;
