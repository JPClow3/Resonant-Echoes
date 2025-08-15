
import React from 'react';

interface InteractiveTextProps {
  text: string;
  className?: string;
  isStreaming?: boolean; 
  id?: string;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ text, isStreaming = false, className = "", id }) => {

  const currentTextToParse = React.useMemo(() => {
    if (!isStreaming || !text) {
      return text || '';
    }

    // Attempt to extract scene text from a streaming, partial JSON object
    const sceneKey = '"scene": "';
    const start = text.indexOf(sceneKey);
    if (start === -1) {
      // If the scene key hasn't arrived yet, show nothing or a placeholder
      return text.length > 2 ? "..." : "";
    }

    const textStart = start + sceneKey.length;
    let rawText = text.substring(textStart);

    // Clean up common trailing JSON artifacts during streaming for a cleaner look
    const endOfSceneGuess = rawText.lastIndexOf('"');
    const endOfChoicesGuess = rawText.lastIndexOf('"choices":');
    if (endOfChoicesGuess > endOfSceneGuess && endOfSceneGuess !== -1) {
        rawText = rawText.substring(0, endOfSceneGuess);
    }
    
    // Replace JSON escape sequences with display characters
    return rawText.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }, [text, isStreaming]);


  if (!currentTextToParse) {
    return <div id={id} className={`${className} leading-relaxed whitespace-pre-wrap`}></div>;
  }
  
  const parts = [];
  let lastIndex = 0;
  const tagRegex = /<(lore-keyword)\s+tip="([^"]*)">(.*?)<\/\1>|<(tone)\s+style=['"]([^['"]+)['"]>(.*?)<\/\4>/g;

  let match;
  while ((match = tagRegex.exec(currentTextToParse)) !== null) {
    if (match.index > lastIndex) {
      parts.push(currentTextToParse.substring(lastIndex, match.index));
    }

    if (match[1] === 'lore-keyword') {
      const tipText = match[2];
      const keywordText = match[3];
      parts.push(
        <span key={`${lastIndex}-lore`} className="lore-keyword">
          {keywordText}
          <span className="tooltip-text">{tipText}</span>
        </span>
      );
    } else if (match[4] === 'tone') {
      const toneStyleName = match[5];
      const toneText = match[6];
      parts.push(
        <span key={`${lastIndex}-tone`} className={`tone-${toneStyleName.toLowerCase()}`}>
          {toneText}
        </span>
      );
    }
    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < currentTextToParse.length) {
    parts.push(currentTextToParse.substring(lastIndex));
  }

  return (
    <div id={id} className={`${className} leading-relaxed whitespace-pre-wrap`}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
      {isStreaming && <span className="inline-block w-2 h-4 bg-accent-primary animate-simple-pulse ml-1" />}
    </div>
  );
};

export default InteractiveText;
