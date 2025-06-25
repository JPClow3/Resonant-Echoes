
import React, { useRef, useEffect } from 'react';

interface IntroVideoPlayerProps {
  src: string;
  onVideoEnd: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Simple check for a typical development environment.
// For robust prod detection, environment variables set during build are better.
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';


const IntroVideoPlayer: React.FC<IntroVideoPlayerProps> = ({ src, onVideoEnd, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (IS_DEVELOPMENT) console.log('[IntroVideoPlayer] useEffect: Attempting to load and play video.', { src, muted: videoElement.muted });
      videoElement.load(); // Explicitly load when sources change or component mounts
      videoElement.muted = true; // Essential for autoplay in most browsers
      videoElement.play().catch(error => {
        console.warn("[IntroVideoPlayer] Video autoplay was prevented or failed in play() call:", error);
        // If autoplay is prevented by browser policy, the user can still skip or an error event will trigger.
      });
    }
  }, [src]); // Depend only on src; videoRef is stable

  const commonLog = (eventName: string, e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (!IS_DEVELOPMENT) return; // Only log in development

    const videoElement = videoRef.current;
    if (videoElement) {
      console.log(`[IntroVideoPlayer] Event: ${eventName}`, {
        currentTime: videoElement.currentTime,
        duration: videoElement.duration,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
        error: videoElement.error,
        paused: videoElement.paused,
        ended: videoElement.ended,
        currentSrc: videoElement.currentSrc, // Changed from src to currentSrc
      });
    } else {
      console.log(`[IntroVideoPlayer] Event: ${eventName} (video element not available)`);
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.target as HTMLVideoElement;
    let errorDetails = "Unknown video error";
    if (videoElement.error) {
      errorDetails = `Code: ${videoElement.error.code}, Message: "${videoElement.error.message}"`;
    }
    // Always log errors, regardless of environment.
    console.error(`[IntroVideoPlayer] Event: error. Playback failed. ${errorDetails}`, {
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
        currentSrc: videoElement.currentSrc,
        currentTime: videoElement.currentTime,
    });
    onVideoEnd(); // Proceed as if video ended to not block the app
  };

  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <video
        ref={videoRef}
        onEnded={() => { commonLog('ended'); onVideoEnd(); }}
        onError={handleVideoError}
        onLoadedMetadata={(e) => commonLog('loadedmetadata', e)}
        onLoadedData={(e) => commonLog('loadeddata', e)}
        onCanPlay={(e) => commonLog('canplay', e)}
        onCanPlayThrough={(e) => commonLog('canplaythrough', e)}
        onPlaying={(e) => commonLog('playing', e)}
        onWaiting={(e) => commonLog('waiting', e)}
        onStalled={(e) => commonLog('stalled', e)}
        onSuspend={(e) => commonLog('suspend', e)}
        onProgress={(e) => commonLog('progress', e)} 
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={src} type="video/mp4" />
        {/* You could add other sources here for better compatibility, e.g.: */}
        {/* <source src={src.replace('.mp4', '.webm')} type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>
      <button
        onClick={() => { if (IS_DEVELOPMENT) console.log('[IntroVideoPlayer] Skip button clicked.'); onVideoEnd(); }}
        style={{
          position: 'absolute',
          bottom: '5vh',
          right: '5vw',
          padding: '12px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontFamily: 'var(--font-body, EB Garamond, serif)', // Fallback font
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label={t("Skip Intro")}
      >
        {t("Skip Intro")}
      </button>
    </div>
  );
};

export default IntroVideoPlayer;
