
import React, { useRef, useEffect, useState } from 'react';
import { WhisperingEchoDetail } from '../types';

interface EchoWeavingModalProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  isOpen: boolean;
  onClose: () => void;
  echoes: WhisperingEchoDetail[];
  onSynthesize: () => void;
}

const EchoOrb: React.FC<{ echo: WhisperingEchoDetail }> = ({ echo }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("echoId", echo.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
    };

    return (
        <div
            id={echo.id}
            className="echo-orb p-3 m-2 bg-primary rounded-full shadow-lg text-center cursor-grab border border-magical-echo-hint-border w-48"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <p className="font-bold text-sm text-magical-echo-hint-color">{echo.typeHint}</p>
            <p className="text-xs text-muted-color italic">"{echo.text.substring(0, 30)}..."</p>
        </div>
    );
};


const EchoWeavingModal: React.FC<EchoWeavingModalProps> = ({ t, isOpen, onClose, echoes, onSynthesize }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [wovenEchoIds, setWovenEchoIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      setWovenEchoIds([]);
    }
  }, [isOpen]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDropActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const echoId = e.dataTransfer.getData("echoId");
    if (echoId && !wovenEchoIds.includes(echoId)) {
        setWovenEchoIds(prev => [...prev, echoId]);
    }
    setIsDropActive(false);
  };
  
  const handleSynthesizeClick = () => {
    if (wovenEchoIds.length > 0) {
        onSynthesize();
    }
  };


  if (!isOpen) {
    return null;
  }

  const unwovenEchoes = echoes.filter(e => !wovenEchoIds.includes(e.id));
  const wovenEchoes = echoes.filter(e => wovenEchoIds.includes(e.id));

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="echo-weaving-title"
      tabIndex={-1}
    >
      <div
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="echo-weaving-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">
            {t("The Weaver's Loom")}
          </h2>
          <button
            onClick={onClose}
            className="fantasy-button fantasy-button-secondary p-2 text-sm"
            aria-label={t("Close Loom")}
          >
            {t("Close Loom")}
          </button>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
            <div className="col-span-1 bg-primary p-3 rounded-lg border border-divider-color overflow-y-auto custom-scrollbar">
                <h3 className="font-heading text-lg text-center text-muted-color">Perceived Echoes</h3>
                <div className="flex flex-col items-center">
                    {unwovenEchoes.length > 0 ? (
                        unwovenEchoes.map(echo => <EchoOrb key={echo.id} echo={echo} />)
                    ) : (
                        <p className="text-sm text-muted-color italic mt-4 text-center">All echoes are in the nexus.</p>
                    )}
                </div>
            </div>

            <div 
                className="md:col-span-2 bg-primary rounded-lg border border-divider-color flex flex-col items-center justify-center p-4 relative overflow-hidden"
            >
                <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`echo-weaving-nexus w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center text-center p-4 ${isDropActive ? 'drop-active' : ''}`}
                >
                    <p className="text-muted-color italic">{t("Drag echo orbs to the nexus to feel their connection.")}</p>
                </div>
                <div className="absolute inset-0 pointer-events-none">
                    {wovenEchoes.map((echo, index) => {
                        const angle = (index / wovenEchoes.length) * 2 * Math.PI;
                        const x = 50 + Math.min(40, wovenEchoes.length * 5) * Math.cos(angle);
                        const y = 50 + Math.min(40, wovenEchoes.length * 5) * Math.sin(angle);
                        return (
                            <div 
                                key={echo.id}
                                className="absolute p-2 bg-magical-echo-hint-color text-black rounded-full shadow-lg animate-gentle-pulse text-center"
                                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                            >
                                <p className="text-xs font-bold">{echo.typeHint}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        
        <div className="mt-4 text-center">
             <button
                onClick={handleSynthesizeClick}
                className={`fantasy-button fantasy-button-primary px-8 py-3 ${(wovenEchoIds.length > 0) ? 'synthesis-button-ready-pulse' : ''}`}
                disabled={wovenEchoIds.length === 0}
            >
                {t("Weave Echoes")}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EchoWeavingModal;
