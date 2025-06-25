
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LoreEntryData, LoreFragmentData } from '../types'; // Adjust path
import InteractiveText from './InteractiveText';

interface LoreJournalProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  loreEntries: LoreEntryData[];
  loreFragments: LoreFragmentData[];
  isOpen: boolean;
  onToggle: () => void;
  showGlow?: boolean; 
  newestEntryId?: string | null; 
  onSynthesizeFragments: (fragmentIds: string[]) => void;
}

const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const LoreJournal: React.FC<LoreJournalProps> = ({ 
    t,
    loreEntries, 
    loreFragments, 
    isOpen, 
    onToggle, 
    newestEntryId,
    onSynthesizeFragments 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const newestEntryRef = useRef<HTMLLIElement>(null);
  const [selectedFragmentIds, setSelectedFragmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      soundService.playSound('LORE_JOURNAL_OPEN');
      modalRef.current?.focus(); 
      if (newestEntryRef.current && newestEntryId) {
        setTimeout(() => {
            newestEntryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); 
      }
      setSelectedFragmentIds([]); 
    } else {
      soundService.playSound('LORE_JOURNAL_CLOSE');
    }
  }, [isOpen, newestEntryId]);
  
  if (!isOpen) {
    return null;
  }

  const sortedEntries = useMemo(() => 
    [...loreEntries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [loreEntries]
  );
  const sortedFragments = useMemo(() =>
    [...loreFragments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [loreFragments]
  );

  const handleFragmentSelection = (fragmentId: string) => {
    setSelectedFragmentIds(prev => 
      prev.includes(fragmentId) ? prev.filter(id => id !== fragmentId) : [...prev, fragmentId]
    );
  };

  const canSynthesizeSelected = () => {
    if (selectedFragmentIds.length < 2) return false;
    const firstSelectedHint = sortedFragments.find(f => f.id === selectedFragmentIds[0])?.relatedLoreIdHint;
    if (!firstSelectedHint) return true; 
    return selectedFragmentIds.every(id => {
        const frag = sortedFragments.find(f => f.id === id);
        return frag?.relatedLoreIdHint === firstSelectedHint || !frag?.relatedLoreIdHint;
    });
  };


  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onToggle} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="lore-journal-title"
      tabIndex={-1}
    >
      <div 
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="lore-journal-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">{t("Tome of Echoes & Lore")}</h2>
          <button 
            onClick={onToggle} 
            className="fantasy-button fantasy-button-secondary p-2 text-sm"
            aria-label={t("Close Tome")}
          >
            {t("Close Tome")}
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 space-y-6">
          {/* Full Lore Entries */}
          <div>
            <h3 className="font-heading text-2xl text-accent-primary mb-2 border-b border-divider-color pb-1">{t("Compiled Knowledge")}</h3>
            {sortedEntries.length > 0 ? (
              <ul className="space-y-3">
                {sortedEntries.map((lore, index) => (
                  <li 
                    key={lore.id} 
                    ref={lore.id === newestEntryId ? newestEntryRef : null}
                    className={`log-entry-appear-staggered ${lore.id === newestEntryId ? 'new-lore-highlight' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s`}}
                  >
                    <details className="bg-primary p-3 rounded-lg border border-divider-color group">
                      <summary className="font-body cursor-pointer text-main-color group-open:mb-2 flex justify-between items-center">
                        <span className="illuminated-first-letter font-bold text-lg">{lore.playerGivenName || lore.title}</span>
                        <span className="text-xs text-muted-color">{new Date(lore.timestamp).toLocaleDateString()}</span>
                      </summary>
                      <InteractiveText text={lore.content} className="text-sm text-main-color mb-1" />
                      {lore.playerGivenName && lore.title !== lore.playerGivenName && <p className="text-xs text-muted-color italic mt-1">{t("(Originally understood as: \"{title}\")", { title: lore.title })}</p>}
                      {lore.context && <p className="text-xs text-muted-color mt-1"><strong>{t("Context:")}</strong> {lore.context}</p>}
                      {lore.discoveryMethod && <p className="text-xs text-muted-color mt-1"><strong>{t("Method:")}</strong> {lore.discoveryMethod}</p>}
                      {lore.triggeringChoice && <p className="text-xs text-muted-color mt-1"><strong>{t("Trigger:")}</strong> {lore.triggeringChoice}</p>}
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-muted-color italic text-center py-4">{t("The pages of compiled knowledge are yet blank.")}</p>
            )}
          </div>

          {/* Lore Fragments */}
          <div>
            <h3 className="font-heading text-2xl text-accent-primary mb-2 border-b border-divider-color pb-1">{t("Scattered Fragments")}</h3>
            {sortedFragments.length > 0 ? (
              <>
                <ul className="space-y-2 mb-3">
                  {sortedFragments.map((fragment, index) => (
                    <li 
                      key={fragment.id} 
                      className={`log-entry-appear-staggered bg-primary p-2.5 rounded-md border border-divider-color ${fragment.linkedToFullLoreId ? 'opacity-60' : ''}`}
                      style={{ animationDelay: `${(sortedEntries.length + index) * 0.05}s`}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           {!fragment.linkedToFullLoreId && (
                            <input 
                                type="checkbox" 
                                id={`frag-select-${fragment.id}`}
                                checked={selectedFragmentIds.includes(fragment.id)}
                                onChange={() => handleFragmentSelection(fragment.id)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                                aria-label={`${t("Select fragment")} ${fragment.titleHint}`}
                            />
                           )}
                          <label htmlFor={`frag-select-${fragment.id}`} className="font-bold text-md text-main-color flex-grow cursor-pointer">
                            {fragment.titleHint} {fragment.linkedToFullLoreId ? <span className="text-xs text-muted-color italic">{t("(Synthesized)")}</span> : ""}
                          </label>
                        </div>
                        <span className="text-xs text-muted-color">{new Date(fragment.timestamp).toLocaleDateString()}</span>
                      </div>
                      <InteractiveText text={fragment.contentFragment} className="text-sm text-main-color mt-1 pl-6" />
                      {fragment.originHint && <p className="text-xs text-muted-color mt-0.5 pl-6"><em>{t("Origin:")}</em> {fragment.originHint}</p>}
                      {fragment.relatedLoreIdHint && <p className="text-xs text-muted-color mt-0.5 pl-6"><em>{t("Hint:")}</em> {t("Connects to {loreIdHint}", { loreIdHint: fragment.relatedLoreIdHint })}</p>}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => { 
                    if (canSynthesizeSelected()) {
                      onSynthesizeFragments(selectedFragmentIds);
                      setSelectedFragmentIds([]); 
                    }
                  }}
                  disabled={!canSynthesizeSelected()}
                  className="fantasy-button fantasy-button-primary w-full text-sm py-2"
                >
                  {t("Synthesize Selected Fragments ({count})", { count: selectedFragmentIds.length })}
                </button>
                <p className="text-xs text-center text-muted-color mt-1">{t("Select 2 or more related fragments to attempt synthesis.")}</p>
              </>
            ) : (
              <p className="font-body text-muted-color italic text-center py-4">{t("No fragments of forgotten lore discovered yet.")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoreJournal;
