import React from 'react';
import { WhisperingEchoDetail } from '../types'; // Adjust path as necessary
import InteractiveText from './InteractiveText';

interface WhisperingEchoesDisplayProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  echoes: WhisperingEchoDetail[];
  isSynthesizing?: boolean;
  clearSignal?: boolean; 
}

const WhisperingEchoesDisplay: React.FC<WhisperingEchoesDisplayProps> = ({ t, echoes, isSynthesizing, clearSignal }) => {
  const getEchoContainerClasses = (echo: WhisperingEchoDetail) => {
    const classes = [];
    if (echo.isFalse) {
      classes.push('echo-false');
      classes.push('echo-glitch'); // False echoes are deceptive and should glitch
      return classes.join(' ');
    }
    
    switch (echo.intensityHint) {
      case 'Faint': classes.push('echo-intensity-faint'); break;
      case 'Clear': classes.push('echo-intensity-clear'); break;
      case 'Strong': classes.push('echo-intensity-strong'); break;
      case 'Overwhelming': classes.push('echo-intensity-overwhelming'); break;
      case 'Chaotic': classes.push('echo-intensity-chaotic'); break;
      default: classes.push('echo-intensity-moderate'); break;
    }
    
    switch (echo.corruptionLevel) {
        case 'Minor': classes.push('echo-corrupted-minor'); break;
        case 'Moderate': classes.push('echo-corrupted-moderate'); break;
        case 'Severe': classes.push('echo-corrupted-severe'); classes.push('echo-glitch'); break; // Severe corruption also glitches
    }

    if (echo.dissonanceFlavor) {
      classes.push('echo-glitch');
    }

    return classes.join(' ');
  };

  if (!echoes || echoes.length === 0) {
    return (
      <div className="p-4 bg-secondary rounded-lg shadow-lg border border-divider-color">
        <h2 className="font-heading text-2xl text-heading-color mb-3 border-b border-divider-color pb-2">{t("Whispering Echoes")}</h2>
        <p className="font-body text-muted-color italic">{t("The Weave is quiet for now...")}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-secondary rounded-lg shadow-lg border border-divider-color max-h-[30rem] overflow-y-auto custom-scrollbar ${isSynthesizing ? 'synthesis-pulse-active' : ''}`}>
      <h2 className="font-heading text-2xl text-heading-color mb-3 border-b border-divider-color pb-2">{t("Whispering Echoes")}</h2>
      <ul className="space-y-3">
        {echoes.map((echo, index) => (
          <li 
            key={echo.id || index} 
            className={`bg-primary p-3 rounded shadow border-l-4 text-sm animate-fadeInUp-story whispering-echo-item ${getEchoContainerClasses(echo)}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <p className="font-body italic text-main-color mb-1">
              <strong>{t("Intensity:")}</strong> {echo.intensityHint}
              {echo.corruptionLevel && <span className="text-magical-dissonance-color"> ({echo.corruptionLevel} Corruption)</span>}
              , <strong>{t("Type:")}</strong> {echo.typeHint}
            </p>
            <InteractiveText text={echo.text} className="text-main-color" />
            {echo.originHint && <p className="text-xs text-muted-color mt-1"><em>{t("Origin:")}</em> {echo.originHint}</p>}
            {echo.emotionalUndercurrent && <p className="text-xs text-muted-color mt-1"><em>{t("Emotion:")}</em> {echo.emotionalUndercurrent}</p>}
            {echo.dominantSensation && <p className="text-xs text-muted-color mt-1"><em>{t("Sensation:")}</em> {echo.dominantSensation}</p>}
            {echo.durationHint && <p className="text-xs text-muted-color mt-1"><em>{t("Duration:")}</em> {echo.durationHint}</p>}
            {echo.clarity && <p className="text-xs text-muted-color mt-1"><em>{t("Clarity:")}</em> {echo.clarity}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default React.memo(WhisperingEchoesDisplay);