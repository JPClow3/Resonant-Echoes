
import React, { useEffect, useRef } from 'react';

interface IntroVideoPlayerProps {
  t: (key: string) => string;
  isOpen: boolean;
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  onVideoEnd: () => void;
  onSkip: () => void;
}

const IntroVideoPlayer: React.FC<IntroVideoPlayerProps> = ({
  t,
  isOpen,
  videoUrl,
  isLoading,
  loadingMessage,
  onVideoEnd,
  onSkip
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
        // Browser policy might prevent autoplay, so we have a skip button.
      });
    }
  }, [videoUrl]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-video-title"
    >
      {isLoading || !videoUrl ? (
        <div className="text-center">
          <div
            className="w-20 h-20 border-8 border-dotted rounded-full animate-spin mb-6"
            style={{ borderColor: 'var(--accent-primary)' }}
          ></div>
          <h2 id="intro-video-title" className="font-heading text-3xl text-heading-color mb-2 animate-simple-pulse">
            {t('A Vision Coalesces...')}
          </h2>
          <p className="font-body text-lg text-muted-color">{loadingMessage}</p>
           <button
            onClick={onSkip}
            className="fantasy-button fantasy-button-secondary text-sm px-4 py-2 mt-8"
          >
            {t('Skip Intro')}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl aspect-video relative">
          <video
            ref={videoRef}
            src={videoUrl}
            onEnded={onVideoEnd}
            className="w-full h-full rounded-lg shadow-2xl border-2 border-accent-primary"
            muted // Autoplay is more likely to work when muted
            playsInline
          />
          <button
            onClick={onSkip}
            className="fantasy-button fantasy-button-secondary absolute bottom-4 right-4 text-sm px-4 py-2 opacity-80 hover:opacity-100"
          >
            {t('Skip Intro')}
          </button>
        </div>
      )}
    </div>
  );
};

export default IntroVideoPlayer;
