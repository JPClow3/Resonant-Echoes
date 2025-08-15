
import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  altText?: string;
  isLoading?: boolean;
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, altText = "Current game scene", isLoading, t }) => {
  if (isLoading && !imageUrl) { // If isLoading is true AND there's no image URL yet, show loading.
    return (
      <div 
        className="w-full h-60 sm:h-80 md:h-96 bg-primary rounded-md flex items-center justify-center text-muted-color italic shadow-lg border border-divider-color animate-simple-pulse"
      >
        {t("A Vision Coalesces...")}
      </div>
    );
  }

  if (!imageUrl) { // If not loading but still no URL (e.g., error or initial state before prompt)
    return (
      <div 
        className="w-full h-60 sm:h-80 md:h-96 bg-primary rounded-md flex items-center justify-center text-muted-color italic shadow-lg border border-divider-color"
      >
        {t("Awaiting a vision...")}
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-divider-color">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-auto object-contain max-h-[calc(100vh-20rem)] sm:max-h-80 md:max-h-96 animate-fadeIn" 
      />
    </div>
  );
};

export default React.memo(ImageDisplay);
