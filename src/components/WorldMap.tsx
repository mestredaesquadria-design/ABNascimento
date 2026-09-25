import React, { useState } from 'react';
import { Destination } from '../types/game.ts';
import { WORLD_CITIES, calculateFlightDurationMinutes, formatMissionTime } from '../services/proceduralGenerator.ts';
import { Plane, Navigation, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface WorldMapProps {
  currentCity: Destination;
  allDestinations: Destination[];
  visitedIndices: number[];
  onTravelToCity: (cityData: typeof WORLD_CITIES[0]) => void;
  isTraveling: boolean;
  travelAnimationCity?: string | null;
  reduceMotion?: boolean;
}

// Convert latitude and longitude to SVG coordinates (Miller Cylindrical projection approx)
function projectCoords(lat: number, lng: number, width: number, height: number): { x: number; y: number } {
  // Longitude: -180 to 180 maps to 0 to width
  const x = ((lng + 180) / 360) * width;
  
  // Latitude: approx -65 to 75 maps to height to 0
  const latRad = (lat * Math.PI) / 180;
  const y = height * (0.5 - 0.38 * Math.log(Math.tan(Math.PI / 4 + latRad * 0.45)));
  
  return {
    x: Math.max(20, Math.min(width - 20, x)),
    y: Math.max(20, Math.min(height - 20, y)),
  };
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentCity,
  allDestinations,
  visitedIndices,
  onTravelToCity,
  isTraveling,
  travelAnimationCity,
  reduceMotion = false,
}) => {
  const mapWidth = 960;
  const mapHeight = 520;
  const [selectedPin, setSelectedPin] = useState<typeof WORLD_CITIES[0] | null>(null);

  const currentCoords = projectCoords(currentCity.lat, currentCity.lng, mapWidth, mapHeight);

  return (
    <div className="relative w-full bg-slate-950 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl">
      {/* Map Header Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-cyan-900/30 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            Radar Global de Vigilância Tática
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
            Local Atual ({currentCity.city})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Investigados ({visitedIndices.length}/6)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            Destinos Possíveis
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[500px]">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Tactical Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width={mapWidth} height={mapHeight} fill="#020617" />
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

          {/* Stylized Simplified Continents Paths */}
          {/* North America */}
          <path
            d="M 140,90 Q 210,60 270,95 T 310,180 T 260,230 T 210,245 T 160,190 T 120,130 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* South America */}
          <path
            d="M 270,255 Q 350,280 340,360 T 290,440 T 250,470 T 240,380 T 250,290 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Europe */}
          <path
            d="M 460,110 Q 540,95 560,150 T 520,200 T 450,205 T 440,150 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Africa */}
          <path
            d="M 450,220 Q 560,210 560,290 T 540,390 T 490,430 T 430,340 T 420,260 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Asia */}
          <path
            d="M 570,110 Q 760,90 820,180 T 790,270 T 670,280 T 580,210 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
          {/* Australia */}
          <path
            d="M 760,340 Q 860,330 870,400 T 790,440 T 740,400 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.2"
          />

          {/* Equator & Meridian Guides */}
          <line x1="0" y1={mapHeight / 2} x2={mapWidth} y2={mapHeight / 2} stroke="rgba(6, 182, 212, 0.12)" strokeDasharray="4 4" />
          <line x1={mapWidth / 2} y1="0" x2={mapWidth / 2} y2={mapHeight} stroke="rgba(6, 182, 212, 0.12)" strokeDasharray="4 4" />

          {/* Draw connecting flight arcs between visited destinations */}
          {allDestinations.slice(0, visitedIndices.length).map((dest, idx) => {
            if (idx === 0) return null;
            const prev = allDestinations[idx - 1];
            const p1 = projectCoords(prev.lat, prev.lng, mapWidth, mapHeight);
            const p2 = projectCoords(dest.lat, dest.lng, mapWidth, mapHeight);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2 - 35; // Curve height

            return (
              <path
                key={`visited-arc-${idx}`}
                d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.85"
              />
            );
          })}

          {/* Active Flight Animation Line if traveling */}
          {isTraveling && travelAnimationCity && (
            (() => {
              const target = WORLD_CITIES.find(c => c.city === travelAnimationCity);
              if (!target) return null;
              const pTarget = projectCoords(target.lat, target.lng, mapWidth, mapHeight);
              const midX = (currentCoords.x + pTarget.x) / 2;
              const midY = (currentCoords.y + pTarget.y) / 2 - 50;

              return (
                <g>
                  <path
                    d={`M ${currentCoords.x} ${currentCoords.y} Q ${midX} ${midY} ${pTarget.x} ${pTarget.y}`}
                    fill="none"
                    stroke="url(#flightGradient)"
                    strokeWidth="3"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                </g>
              );
            })()
          )}

          {/* City Nodes */}
          {WORLD_CITIES.map((cityItem) => {
            const { x, y } = projectCoords(cityItem.lat, cityItem.lng, mapWidth, mapHeight);
            const isCurrent = cityItem.city === currentCity.city;
            const caseDestIndex = allDestinations.findIndex(d => d.city === cityItem.city);
            const isVisited = caseDestIndex !== -1 && visitedIndices.includes(caseDestIndex);
            const isDestinationInCase = caseDestIndex !== -1;
            const isSelected = selectedPin?.city === cityItem.city;

            return (
              <g
                key={cityItem.city}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedPin(cityItem)}
              >
                {/* Pulsing Radar Ring for Current Location */}
                {isCurrent && !reduceMotion && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Pin Base Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 7 : isVisited ? 5.5 : isDestinationInCase ? 5 : 3.5}
                  fill={
                    isCurrent
                      ? '#06b6d4'
                      : isVisited
                      ? '#10b981'
                      : isDestinationInCase
                      ? '#f59e0b'
                      : '#475569'
                  }
                  stroke="#020617"
                  strokeWidth="2"
                  filter={isCurrent || isSelected ? 'url(#glow)' : undefined}
                />

                {/* City Label */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tracking-tight pointer-events-none select-none ${
                    isCurrent
                      ? 'fill-cyan-300 font-bold text-[11px]'
                      : isVisited
                      ? 'fill-emerald-400 font-semibold'
                      : isDestinationInCase
                      ? 'fill-amber-300'
                      : 'fill-slate-500'
                  }`}
                >
                  {cityItem.flag} {cityItem.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected City Tactical Dossier Flyout */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md rounded-xl p-4 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedPin.flag}</span>
                  <h4 className="font-bold text-slate-100 text-base">{selectedPin.city}</h4>
                  <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded">
                    {selectedPin.airportCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPin.country}</p>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-100 p-1 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Ponto Notório:</span>
                <span className="text-slate-200">{selectedPin.landmark}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Moeda Local:</span>
                <span className="text-slate-200">{selectedPin.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tempo de Voo Estimado:</span>
                <span className="text-cyan-400 font-semibold">
                  {selectedPin.city === currentCity.city
                    ? 'Localização Atual'
                    : formatMissionTime(
                        calculateFlightDurationMinutes(
                          currentCity.lat,
                          currentCity.lng,
                          selectedPin.lat,
                          selectedPin.lng
                        )
                      ) + ' h'}
                </span>
              </div>
            </div>

            {selectedPin.city === currentCity.city ? (
              <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 p-2.5 rounded-lg">
                <Navigation className="w-4 h-4 shrink-0" />
                <span>O Agente X está posicionado nesta localidade atualmente.</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onTravelToCity(selectedPin);
                  setSelectedPin(null);
                }}
                disabled={isTraveling}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:bg-slate-800 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-cyan-900/30"
              >
                <Plane className="w-4 h-4" />
                {isTraveling ? 'Calculando Voo...' : `Viajar para ${selectedPin.city}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div>
          <span className="text-slate-500 font-mono mr-1">Coordenadas:</span>
          <span className="font-mono text-cyan-300">
            {currentCity.lat.toFixed(4)}° N, {currentCity.lng.toFixed(4)}° W
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>{currentCity.flag} {currentCity.country}</span>
          <span>·</span>
          <span>Terminal: {currentCity.airportCode}</span>
        </div>
      </div>
    </div>
  );
};
