import React from 'react';
import { PlayerInventoryItem, CharacterProfile, DissonantAberration } from '../types'; // Adjust path as necessary
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
  let pathData = "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.41l.83-1zM5 19V8h14v11H5z"; // Default box/bag icon
  const lowerName = itemName.toLowerCase();
  if (lowerName.includes('shard') || lowerName.includes('crystal')) pathData = "M11 2L2 12l9 10 9-10-9-10zm0 2.37L18.63 12 11 19.63 3.37 12 11 4.37z"; // Crystal/gem
  else if (lowerName.includes('tome') || lowerName.includes('journal') || lowerName.includes('book') || lowerName.includes('primer')) pathData = "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"; // Book
  else if (lowerName.includes('amulet') || lowerName.includes('charm')) pathData = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9l4-4 1.41 1.41L11.83 12l3.58 3.59L14 17l-4-4z"; // Amulet-like circle

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mr-2 inline-block flex-shrink-0 ${iconColor}`}>
      <path d={pathData} />
    </svg>
  );
};

const AberrationDisplay = ({ t, aberrations }: { t: (key: string) => string; aberrations: DissonantAberration[] }) => {
    return (
        <div className="mt-2">
            <h4 className="font-body text-md text-magical-dissonance-color mb-1">{t("Threats")}</h4>
            <ul className="space-y-1 text-sm">
                {aberrations.map(aberration => (
                    <li key={aberration.id} className="text-magical-dissonance-text p-1 bg-magical-dissonance-bg rounded border-l-2 border-magical-dissonance-border">
                        <InteractiveText text={`<strong>${aberration.name}</strong> (${aberration.aberrationNature}): ${aberration.description}`} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface GameStatusDisplayProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  timeOfDay?: string;
  weather?: string;
  inventory: Record<string, PlayerInventoryItem>;
  onAttune: (itemName: string) => void;
  characterProfile: CharacterProfile | null;
  activeAberrations?: DissonantAberration[];
}

const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({
  t,
  timeOfDay,
  weather,
  inventory,
  onAttune,
  characterProfile,
  activeAberrations
}) => {
  const inventoryItems = Object.entries(inventory);

  return (
    <div className="p-3 bg-secondary rounded-lg shadow border border-divider-color">
      <h3 className="font-heading text-lg text-heading-color mb-2 text-center">{t("Player Status")}</h3>
      <div className="space-y-2 text-sm">
        {characterProfile && timeOfDay && (
          <div className="flex items-center text-main-color">
            <TimeIcon time={timeOfDay} />
            <span>{timeOfDay}</span>
          </div>
        )}
        {characterProfile && weather && (
          <div className="flex items-center text-main-color">
            <WeatherIcon weather={weather} />
            <span>{weather}</span>
          </div>
        )}
        {(activeAberrations && activeAberrations.length > 0) && (
            <AberrationDisplay t={t} aberrations={activeAberrations} />
        )}
        {inventoryItems.length > 0 && (
          <div>
            <h4 className="font-body text-md text-accent-primary mt-2 mb-1">{t("Inventory:")}</h4>
            <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              {inventoryItems.map(([name, item]) => (
                <li key={name} className="flex items-center justify-between group">
                  <div className="flex items-center">
                    <ItemIcon
                      itemName={name}
                      hasUndiscoveredEchoes={!!(item.artifactEchoes && item.artifactEchoes.length > (item.knownArtifactEchoes?.length || 0))}
                      isEchoicHeirloom={item.isEchoicHeirloom}
                    />
                    <span className="text-main-color">{name} (x{item.count})</span>
                  </div>
                  {item.artifactEchoes && item.artifactEchoes.length > (item.knownArtifactEchoes?.length || 0) && (
                    <button onClick={() => onAttune(name)} className="fantasy-button fantasy-button-subtle text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("Attune to Echoes")}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {characterProfile && inventoryItems.length === 0 && (!activeAberrations || activeAberrations.length === 0) && (
            <p className="text-xs text-muted-color italic text-center mt-2">{t("The Weave is calm, your satchel light.")}</p>
        )}
      </div>
    </div>
  );
};

export default GameStatusDisplay;