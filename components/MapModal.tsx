
import React, { useRef, useEffect } from 'react';
import { LocationData } from '../types';

interface MapModalProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  isOpen: boolean;
  onClose: () => void;
  locations: LocationData[];
  currentLocationId: string | null;
}

const MapModal: React.FC<MapModalProps> = ({ t, isOpen, onClose, locations, currentLocationId }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
      tabIndex={-1}
    >
      <div
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="map-modal-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">
            {t("Chronicle Map")}
          </h2>
          <button
            onClick={onClose}
            className="fantasy-button fantasy-button-secondary p-2 text-sm"
            aria-label={t("Close Map")}
          >
            {t("Close Map")}
          </button>
        </div>
        <div className="flex-grow map-container">
          {locations.length > 0 ? (
            locations.map(loc => (
              <div
                key={loc.id}
                className={`map-location-dot ${loc.id === currentLocationId ? 'current-location' : ''}`}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                title={loc.name}
              >
                <div className="map-tooltip">
                  <h4 className="font-bold">{loc.name}</h4>
                  <p className="text-xs">{loc.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="font-body text-muted-color italic text-center py-4">
                    {t("The world of Aerthos is yet to be explored.")}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModal;
