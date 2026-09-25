import React from 'react';
import { Destination } from '../types/game.ts';
import { Plane, MapPin, Landmark, Sparkles, Globe, Compass, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface CityArrivalModalProps {
  isOpen: boolean;
  destination: Destination;
  clueNumber: number;
  totalClues: number;
  unlockedClueText: string;
  isFinalDestination: boolean;
  onContinue: () => void;
}

export const CityArrivalModal: React.FC<CityArrivalModalProps> = ({
  isOpen,
  destination,
  clueNumber,
  totalClues,
  unlockedClueText,
  isFinalDestination,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Banner with City Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
          {destination.photoUrl ? (
            <img
              src={destination.photoUrl}
              alt={destination.city}
              className="w-full h-full object-cover brightness-75 contrast-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-cyan-500">
              <Globe className="w-16 h-16 opacity-30 animate-pulse" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Header Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-950/90 border border-cyan-500/60 rounded-full text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Plane className="w-3.5 h-3.5 text-cyan-400 rotate-45" />
              <span>VOO CONCLUÍDO — POUSO CONFIRMADO</span>
            </span>
            <span className="px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-full text-slate-300 font-mono text-xs font-bold">
              {destination.airportCode}
            </span>
          </div>

          {/* City Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{destination.flag}</span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-md">
                    {destination.city}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-cyan-300 drop-shadow">
                    {destination.country}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-300 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-700/60 backdrop-blur-sm">
              <div className="text-slate-400 text-[10px] uppercase">Etapa do Rastreamento</div>
              <div className="text-cyan-400 font-bold text-sm">
                {clueNumber} de {totalClues}
              </div>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 font-mono flex-1">
          
          {/* City Discovery Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {destination.landmark && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Ponto Notório & Patrimônio</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {destination.landmark}
                </p>
              </div>
            )}

            {destination.culturalFact && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curiosidade Cultural</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {destination.culturalFact}
                </p>
              </div>
            )}

            {destination.geoInfo && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Informação Geográfica</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {destination.geoInfo}
                </p>
              </div>
            )}

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px] uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>Dados do Destino</span>
              </div>
              <div className="text-slate-300 text-xs space-y-0.5">
                <div>• Moeda: <strong>{destination.currency || 'Moeda Local'}</strong></div>
                <div>• Idioma: <strong>{destination.language || 'Oficial'}</strong></div>
              </div>
            </div>
          </div>

          {/* NEW CLUE UNLOCKED BOX */}
          <div className={`p-4 rounded-xl border-2 space-y-2 ${
            isFinalDestination 
              ? 'bg-red-950/50 border-red-500/80 text-red-100 shadow-xl shadow-red-950/40' 
              : 'bg-cyan-950/50 border-cyan-500/80 text-cyan-100 shadow-xl shadow-cyan-950/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className={`w-4 h-4 ${isFinalDestination ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                <span className={`font-bold text-xs uppercase tracking-wider ${isFinalDestination ? 'text-red-300' : 'text-cyan-300'}`}>
                  {isFinalDestination ? '🚨 PISTA FINAL & ESCONDERIJO IDENTIFICADO' : `🔎 PISTA #${clueNumber} DESBLOQUEADA`}
                </span>
              </div>
              <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded text-slate-300">
                Transmissão da Agência
              </span>
            </div>
            
            <p className="text-xs sm:text-sm font-mono leading-relaxed pt-1 text-slate-100 font-medium">
              "{unlockedClueText}"
            </p>

            {isFinalDestination && (
              <div className="pt-2 border-t border-red-800/60 text-xs text-red-300 font-bold flex items-center gap-1.5">
                <span>⚠️ O cronômetro de 20:00 para emissão do Mandado de Prisão está ativado!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 font-mono">
          <span className="text-slate-500 text-xs hidden sm:inline">
            Status: Pista indexada ao Dossiê
          </span>
          <button
            onClick={() => {
              audioEngine.playClick();
              onContinue();
            }}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              isFinalDestination
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950'
            }`}
          >
            <span>{isFinalDestination ? 'Entendido! Ir para Captura' : 'Iniciar Investigação no Local'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
