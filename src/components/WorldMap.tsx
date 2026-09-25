import React, { useState } from 'react';
import { Destination } from '../types/game.ts';
import { WORLD_CITIES, calculateFlightDurationMinutes, formatMissionTime } from '../services/proceduralGenerator.ts';
import { Plane, Navigation, CheckCircle2, AlertTriangle, Radio, Globe, Compass, Landmark, Sparkles, MapPin, X } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

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
  const x = ((lng + 180) / 360) * width;
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
  const [citySearchFilter, setCitySearchFilter] = useState('');

  const currentCoords = projectCoords(currentCity.lat, currentCity.lng, mapWidth, mapHeight);

  const filteredCities = WORLD_CITIES.filter(c => 
    c.city.toLowerCase().includes(citySearchFilter.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearchFilter.toLowerCase()) ||
    c.airportCode.toLowerCase().includes(citySearchFilter.toLowerCase())
  );

  return (
    <div className="relative w-full bg-slate-950 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
      {/* Map Header Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-cyan-900/30 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-cyan-400 font-bold tracking-wider uppercase">
            Radar Global de Vigilância Tática
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400/50"></span>
            <span>Local Atual ({currentCity.city})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Investigadas ({visitedIndices.length})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
            <span>Rotas Mundiais</span>
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

          {/* Stylized Continents Paths */}
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

          {/* Draw connecting flight arcs between ONLY visited destinations */}
          {allDestinations.slice(0, visitedIndices.length).map((dest, idx) => {
            if (idx === 0) return null;
            const prev = allDestinations[idx - 1];
            const p1 = projectCoords(prev.lat, prev.lng, mapWidth, mapHeight);
            const p2 = projectCoords(dest.lat, dest.lng, mapWidth, mapHeight);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2 - 35;

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
                    strokeWidth="3.5"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                </g>
              );
            })()
          )}

          {/* City Nodes: Strict Carmen Sandiego anti-spoiler rule:
              - ONLY current city (cyan)
              - ONLY already visited cities (emerald green)
              - All other destinations are neutral slate (#475569) so future route is NOT spoiled!
          */}
          {WORLD_CITIES.map((cityItem) => {
            const { x, y } = projectCoords(cityItem.lat, cityItem.lng, mapWidth, mapHeight);
            const isCurrent = cityItem.city === currentCity.city;
            const caseDestIndex = allDestinations.findIndex(d => d.city === cityItem.city);
            const isVisited = caseDestIndex !== -1 && visitedIndices.includes(caseDestIndex);
            const isSelected = selectedPin?.city === cityItem.city;

            return (
              <g
                key={cityItem.city}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedPin(cityItem);
                }}
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

                {/* Selection Highlight Ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}

                {/* Pin Base Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 7 : isVisited ? 5.5 : 4}
                  fill={
                    isCurrent
                      ? '#06b6d4'
                      : isVisited
                      ? '#10b981'
                      : '#64748b'
                  }
                  stroke="#020617"
                  strokeWidth="2"
                  filter={isCurrent || isSelected ? 'url(#glow)' : undefined}
                />

                {/* City Label */}
                <text
                  x={x}
                  y={y - 9}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tracking-tight pointer-events-none select-none ${
                    isCurrent
                      ? 'fill-cyan-300 font-bold text-[11px]'
                      : isVisited
                      ? 'fill-emerald-400 font-semibold'
                      : 'fill-slate-400'
                  }`}
                >
                  {cityItem.flag} {cityItem.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected City Tactical Flyout Card (O Cartão de Destino Solicitado) */}
        {selectedPin && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-[420px] bg-slate-900/95 border-2 border-cyan-500/60 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPin.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-100 text-base">{selectedPin.city}</h4>
                    <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded font-bold">
                      {selectedPin.airportCode}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-200/80">{selectedPin.country}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-100 p-1 text-base font-mono cursor-pointer"
                title="Fechar Cartão"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview of Selected City */}
            {selectedPin.image && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 border border-slate-800">
                <img
                  src={selectedPin.image}
                  alt={selectedPin.city}
                  className="w-full h-full object-cover brightness-80 contrast-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[11px] text-white font-bold drop-shadow">
                  {selectedPin.landmark}
                </span>
              </div>
            )}

            {/* Cultural & Travel Information */}
            <div className="space-y-1.5 text-xs text-slate-300 mb-3 font-mono">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Moeda & Idioma: <strong className="text-slate-100">{selectedPin.currency} · {selectedPin.language}</strong></span>
              </div>

              {selectedPin.culturalFact && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedPin.culturalFact}</span>
                </div>
              )}

              {selectedPin.city !== currentCity.city && (
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold pt-1">
                  <Plane className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Duração Estimada do Voo: {formatMissionTime(calculateFlightDurationMinutes(currentCity.lat, currentCity.lng, selectedPin.lat, selectedPin.lng))} h</span>
                </div>
              )}
            </div>

            {/* Travel Action Button */}
            {selectedPin.city === currentCity.city ? (
              <div className="w-full py-2.5 px-4 bg-slate-950 border border-cyan-800/40 rounded-xl text-center text-xs text-cyan-400 font-bold">
                📍 Você já se encontra investigando em {selectedPin.city}
              </div>
            ) : (
              <button
                type="button"
                disabled={isTraveling}
                onClick={() => {
                  audioEngine.playClick();
                  onTravelToCity(selectedPin);
                  setSelectedPin(null);
                }}
                className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  isTraveling 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/60'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>✈️ VIAJAR PARA {selectedPin.city.toUpperCase()}</span>
              </button>
            )}

          </div>
        )}
      </div>

      {/* Quick City Directory / Departure Board */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Painel de Embarque de Capitais Internacionais:
          </span>
          <input
            type="text"
            value={citySearchFilter}
            onChange={(e) => setCitySearchFilter(e.target.value)}
            placeholder="Filtrar cidade, país ou código aeroportuário..."
            className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-full sm:w-64"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filteredCities.map((city) => {
            const isCurrent = city.city === currentCity.city;
            const isSelected = selectedPin?.city === city.city;

            return (
              <button
                key={`btn-city-${city.city}`}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedPin(city);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                    : isSelected
                    ? 'bg-slate-800 border-cyan-400 text-slate-100 ring-1 ring-cyan-400'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <span>{city.flag}</span>
                <span>{city.city}</span>
                <span className="text-[10px] text-slate-500">({city.airportCode})</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
