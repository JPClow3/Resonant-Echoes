
import React from 'react';
import { PlayerInventoryItem, CharacterProfile } from '../types'; // Adjust path as necessary
import InteractiveText from './InteractiveText';

interface IconPropsBase {
  className?: string;
}

interface TimeIconProps extends IconPropsBase {
  time: string;
}
const TimeIcon = ({ time, className = "w-5 h-5 mr-2 inline-block text-accent-primary flex-shrink-0" }: TimeIconProps): JSX.Element => {
  let pathData = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"; // Default clock
  const lowerTime = time.toLowerCase();
  if (lowerTime.includes('night') || lowerTime.includes('midnight') || lowerTime.includes('dusk')) pathData = "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.67 0-4.85-2.01-4.85-4.51 0-1.61.87-3.03 2.16-3.84A8.95 8.95 0 0012 3z"; // Moon
  else if (lowerTime.includes('day') || lowerTime.includes('midday') || lowerTime.includes('morning') || lowerTime.includes('afternoon') || lowerTime.includes('dawn')) pathData = "M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 7c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1-1-.45-1-1-1z"; // Sun
  return ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d={pathData} /> </svg> );
};

interface WeatherIconProps extends IconPropsBase {
  weather: string;
}
const WeatherIcon = ({ weather, className = "w-5 h-5 mr-2 inline-block text-accent-primary flex-shrink-0" }: WeatherIconProps): JSX.Element => {
  let pathData = "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 8.69 9.5 7 12 7s4.63 1.69 5.29 4H19c1.65 0 3 1.35 3 3s-1.35 3-3 3z"; // Default cloud
  const lowerWeather = weather.toLowerCase();
  if (lowerWeather.includes('rain')) pathData = "M12 4C9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM7 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S5.5 16.17 5.5 17 6.17 18.5 7 18.5zm4 2c.83 0 1.5-.67 1.5-1.5S11.83 17.5 11 17.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm4-2c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S13.5 16.17 13.5 17s.67 1.5 1.5 1.5z"; // Rain
  else if (lowerWeather.includes('storm') || lowerWeather.includes('thunder')) pathData = "M12 2L6.5 11H10v5l5.5-9H12V2z M12 4.47L13.76 10H11l-1 5.53L15.24 8H13V4.47z"; // Simplified Lightning
  else if (lowerWeather.includes('clear') || lowerWeather.includes('sun')) pathData = "M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 7c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1-1-.45-1-1-1z"; // Sun
  else if (lowerWeather.includes('snow')) pathData = "M19 13h-1.71l.93-.93a.996.996 0 10-1.41-1.41L15 12.41V11a1 1 0 00-2 0v1.41l-1.72-1.72a.996.996 0 10-1.41 1.41l.93.93H8a1 1 0 000 2h1.29l-.93.93a.996.996 0 101.41 1.41L11.59 15H13v1.41l1.72 1.72a.996.996 0 101.41-1.41l-.93-.93H17a1 1 0 000-2zm-6 0H9.41l1.3-1.29a.996.996 0 000-1.41L9.41 9H11v4zm4-2h1.59l-1.3 1.29a.996.996 0 101.41 1.41L17.59 13H15v-2z"; // Snow
  return ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d={pathData} /> </svg> );
};

interface ItemIconProps extends IconPropsBase {
  itemName: string;
  hasUndiscoveredEchoes?: boolean;
  isEchoicHeirloom?: boolean;
}
const ItemIcon = ({ itemName, hasUndiscoveredEchoes, isEchoicHeirloom }: ItemIconProps): JSX.Element => {
  let iconColor = 'text-accent-secondary';
  if (hasUndiscoveredEchoes) iconColor = 'text-magical-echo-hint animate-gentle-pulse';
  else if (isEchoicHeirloom) iconColor = 'text-lore-keyword-text animate-simple-pulse';
  let pathData = "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6 5h12v1.5L12 9 6 6.5V5zm14 14H4V8l8 5 8-5v11z"; // Default bag/item
  if (itemName.toLowerCase().includes('key') || itemName.toLowerCase().includes('rune')) pathData = "M14.59 6.59c-1.56-1.56-4.09-1.56-5.66 0s-1.56 4.09 0 5.66l-3.54 3.54c-.78.78-.78 2.05 0 2.83s2.05.78 2.83 0l3.54-3.54c1.56 1.56 4.09 1.56 5.66 0s1.56-4.09 0-5.66L14.59 6.59zm-1.41 4.24c-.78.78-2.05.78-2.83 0s-.78-2.05 0-2.83 2.05-.78 2.83 0 .78 2.05 0 2.83z"; // Key
  else if (hasUndiscoveredEchoes) pathData = "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 18c-3.98 0-7.37-2.55-8.48-6H12v2.77L15.82 14H12v-2h8.48c.18.64.29 1.31.32 2H12c0 3.31 2.69 6 6 6 .34 0 .67-.03.99-.08C17.91 21.49 15.11 22 12 22zm8.92-4.59L18 16l-2.92 1.41L16 14.18 13.09 13l2.91-1.18L15.08 9l2.92-1.41L18 11l2.92-1.41L20 12.82l2.91 1.18-2.91 1.18zM4.52 16H0v-2h3.68c-.11-.64-.23-1.31-.32-2H0v-2h4.52c1.12-3.45 4.51-6 8.48-6V0c-4.42 0-8.14 2.56-9.86 6.23A4.002 4.002 0 000 10v4c0 1.4.74 2.64 1.86 3.32A10.007 10.007 0 004.52 16z"; // Orb/magic item
  else if (isEchoicHeirloom) pathData = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"; // Gem/Heirloom
  return ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 mr-1.5 inline-block flex-shrink-0 ${iconColor}`} fill="currentColor" stroke={isEchoicHeirloom ? "var(--lore-keyword-text)" : "currentColor"} strokeWidth={isEchoicHeirloom ? "1" : "0"}  strokeLinecap="round" strokeLinejoin="round" > <path d={pathData} /> </svg> );
};

const formatItemName = (camelCaseName: string): string => camelCaseName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

interface GameStatusDisplayProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  timeOfDay?: string;
  weather?: string;
  inventory?: Record<string, PlayerInventoryItem>;
  onAttune: (itemName: string) => void;
  characterProfile?: CharacterProfile | null;
}

const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({ t, timeOfDay, weather, inventory, onAttune, characterProfile }) => {
  const inventoryItems = inventory ? Object.entries(inventory).filter(([, data]) => data.count > 0) : [];
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  return (
    <div className="game-status-display p-3 bg-primary rounded-lg shadow border border-divider-color text-sm text-main-color max-h-[26rem] overflow-y-auto custom-scrollbar">
      {characterProfile && (
        <div className="mb-3 pb-3 border-b border-divider-color">
          <h3 className="font-heading text-lg text-heading-color leading-tight">{characterProfile.firstName}</h3>
          <p className="text-xs text-muted-color italic leading-tight">{characterProfile.archetype.title}</p>
          <p className="text-xs text-muted-color leading-tight">{characterProfile.origin.name} - <span className="italic">{characterProfile.background.title}</span></p>
        </div>
      )}
      {timeOfDay && (
        <p className="flex items-center text-sm mb-1.5">
          <TimeIcon time={timeOfDay} /> {timeOfDay}
        </p>
      )}
      {weather && (
        <p className="flex items-center text-sm mb-3">
          <WeatherIcon weather={weather} /> {weather}
        </p>
      )}
      {inventoryItems.length > 0 && (
        <div className="mt-2 pt-2 border-t border-divider-color">
          <h4 className="font-semibold text-heading-color mb-1.5">{t("Inventory:")}</h4>
          <ul className="space-y-1.5 text-xs">
            {inventoryItems.map(([itemName, itemData]) => (
              <li key={itemName} className="p-2 bg-secondary rounded border border-divider-color shadow-sm">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === itemName ? null : itemName)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setExpandedItem(expandedItem === itemName ? null : itemName)} aria-expanded={expandedItem === itemName}>
                  <span className="flex items-center font-medium text-main-color">
                    <ItemIcon itemName={itemName} hasUndiscoveredEchoes={!!(itemData.artifactEchoes && itemData.artifactEchoes.length > 0 && (!itemData.knownArtifactEchoes || itemData.knownArtifactEchoes.length < itemData.artifactEchoes.length))} isEchoicHeirloom={itemData.isEchoicHeirloom} />
                    {formatItemName(itemName)} (x{itemData.count})
                  </span>
                  {itemData.description && <span className={"transform transition-transform duration-200 " + (expandedItem === itemName ? "rotate-180" : "")}>▼</span>}
                </div>
                {expandedItem === itemName && itemData.description && (
                  <div className="mt-1.5 pt-1.5 border-t border-dotted border-gray-500 text-muted-color">
                    <InteractiveText text={itemData.description} className="text-xs" />
                    {itemData.artifactEchoes && itemData.artifactEchoes.length > 0 && (!itemData.knownArtifactEchoes || itemData.knownArtifactEchoes.length < itemData.artifactEchoes.length) && (
                       <button onClick={() => onAttune(itemName)} className="text-xs fantasy-button fantasy-button-subtle p-1 mt-1.5 w-full">{t("Attune to Echoes")}</button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
       {inventoryItems.length === 0 && !characterProfile && !timeOfDay && !weather && (
         <p className="text-xs text-muted-color italic text-center py-2">{t("The Weave is calm, your satchel light.")}</p>
       )}
    </div>
  );
};

export default React.memo(GameStatusDisplay);
