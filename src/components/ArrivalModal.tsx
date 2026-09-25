import React, { useEffect } from 'react';
import { Destination } from '../types/game.ts';
import { Plane, Compass, Sparkles, MapPin, Landmark, Globe, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface ArrivalModalProps {
  destination: Destination;
  stepIndex: number;
  totalSteps: number;
  isFinalDestination: boolean;
  onProceed: () => void;
}

export const ArrivalModal: React.FC<ArrivalModalProps> = ({
  destination,
  stepIndex,
  totalSteps,
  isFinalDestination,
  onProceed,
}) => {
  useEffect(() => {
    audioEngine.playSuccess();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Destination Hero Banner with Verified Photo */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950 shrink-0">
          {destination.photoUrl ? (
            <img
              src={destination.photoUrl}
              alt={destination.city}
              className="w-full h-full object-cover brightness-75 contrast-110"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-950 to-slate-950 flex items-center justify-center">
              <Compass className="w-16 h-16 text-cyan-500/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Top Status Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold shadow-lg backdrop-blur-md">
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
              <span>DESEMBARQUE CONFIRMADO</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
              <span>Etapa {stepIndex + 1} de {totalSteps}</span>
            </div>
          </div>

          {/* City & Country Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-white font-mono drop-shadow-md">
              <span>{destination.flag}</span>
              <span>{destination.city}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500 text-cyan-300 font-bold ml-1 font-mono">
                {destination.airportCode}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-cyan-200 font-semibold drop-shadow">
              {destination.country}
            </div>
          </div>
        </div>

        {/* Modal Body: Cultural Facts + Newly Unlocked Progressive Clue */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs sm:text-sm">
          
          {/* Quick Cultural & Geographic Information (As requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {destination.landmark && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <Landmark className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Ponto Turístico / Marco:</span>
                  <span className="text-slate-200 font-semibold">{destination.landmark}</span>
                </div>
              </div>
            )}

            {destination.currency && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Moeda & Idioma:</span>
                  <span className="text-slate-200 font-semibold">{destination.currency} · {destination.language}</span>
                </div>
              </div>
            )}

            {destination.culturalFact && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Curiosidade Cultural:</span>
                  <span className="text-slate-300">{destination.culturalFact}</span>
                </div>
              </div>
            )}

            {destination.geoInfo && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Informação Geográfica:</span>
                  <span className="text-slate-300">{destination.geoInfo}</span>
                </div>
              </div>
            )}
          </div>

          {/* NEWLY UNLOCKED PROGRESSIVE CLUE (REGRA PRINCIPAL) */}
          <div className={`p-4 rounded-xl border-2 shadow-lg ${
            isFinalDestination 
              ? 'bg-red-950/50 border-red-500 text-red-100 ring-2 ring-red-500/50'
              : 'bg-cyan-950/50 border-cyan-500 text-slate-100 ring-2 ring-cyan-500/40'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-wider text-xs sm:text-sm">
              {isFinalDestination ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400">🚨 DESTINO FINAL DO SUSPEITO — PISTA DECISIVA</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-bounce" />
                  <span className="text-cyan-400">🔎 NOVA PISTA DESBLOQUEADA (Pista {stepIndex + 1} de {totalSteps})</span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base font-sans font-medium text-slate-100 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              "{destination.progressiveClue || destination.clues[0]?.text}"
            </p>

            <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isFinalDestination ? '⚠️ O suspeito foi encurralado neste local!' : '💡 Esta pista aponta com precisão o próximo destino da rota de fuga.'}</span>
              <span className="text-cyan-400 font-bold uppercase">Dossiê Atualizado</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => {
              audioEngine.playClick();
              onProceed();
            }}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isFinalDestination
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/60'
            }`}
          >
            <span>{isFinalDestination ? 'Iniciar Protocolo de Cerco e Prisão' : 'Iniciar Investigação no Local'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
