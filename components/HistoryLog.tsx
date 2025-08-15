
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HistoryEntry } from '../types'; // Adjust path
import InteractiveText from './InteractiveText';

interface HistoryLogProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  historyLog: HistoryEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const HistoryLog: React.FC<HistoryLogProps> = ({ t, historyLog, isOpen, onToggle }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundService.playSound('HISTORY_LOG_OPEN');
      modalRef.current?.focus(); 
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight;
      }
    } else {
      soundService.playSound('HISTORY_LOG_CLOSE');
    }
  }, [isOpen, historyLog.length]); 

  if (!isOpen) {
    return null;
  }

  const reversedLog = useMemo(() => 
    [...historyLog].reverse(), 
    [historyLog]
  ); 

  const getEntryTitle = (entry: HistoryEntry): string => {
    switch (entry.type) {
      case 'choice':
        return t("Your Choice: {choice}", { choice: entry.choiceMade || 'Unknown Action' });
      case 'reflection':
        return t("Personal Reflection:");
      case 'named_insight':
        return t("Insight Named"); 
      case 'lore_synthesis':
        return t("Lore Synthesized");
      case 'artifact_attunement':
        return t("Artifact Attuned");
      case 'echo_weaving_cost':
        return t("Echo Weaving Toll");
      case 'dissonance_encounter':
        return t("Dissonance Encountered");
      case 'character_creation':
        return t("Character Milestone");
      default:
        return t("Path Unfolds...");
    }
  };


  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onToggle} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-log-title"
      tabIndex={-1}
    >
      <div 
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="history-log-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">{t("The Path Taken")}</h2>
          <button 
            onClick={onToggle} 
            className="fantasy-button fantasy-button-secondary p-2 text-sm"
            aria-label={t("Close Scroll")}
          >
            {t("Close Scroll")}
          </button>
        </div>

        <div ref={scrollableContentRef} className="overflow-y-auto custom-scrollbar flex-grow pr-2">
          {reversedLog.length > 0 ? (
            <ul className="space-y-3">
              {reversedLog.map((entry, index) => (
                <li 
                  key={entry.id} 
                  className="log-entry-appear-staggered"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <details className="bg-primary p-3 rounded-lg border border-divider-color group" open={index === 0}> 
                    <summary className="font-body cursor-pointer text-main-color group-open:mb-2 flex justify-between items-center">
                      <span className={`font-bold text-md ${entry.type === 'choice' ? 'history-log-player-choice' : ''} ${entry.type === 'reflection' ? 'italic text-accent-primary' : ''}`}>
                        {getEntryTitle(entry)}
                      </span>
                      <span className="text-xs text-muted-color">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </summary>
                    <InteractiveText text={entry.sceneSummary} className="text-sm text-main-color mb-1" />
                    {entry.type === 'choice' && entry.choiceMade && entry.fullSceneText !== entry.sceneSummary && (
                        <details className="text-xs mt-1">
                            <summary className="cursor-pointer text-muted-color italic">{t("Full context...")}</summary>
                            <InteractiveText text={entry.fullSceneText} className="text-xs text-muted-color p-1 bg-primary border border-divider-color rounded" />
                        </details>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-muted-color italic text-center py-8">{t("The scroll of your journey is yet to be written.")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryLog;
