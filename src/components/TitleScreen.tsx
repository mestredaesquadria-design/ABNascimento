import React from 'react';
import { AgentProfile } from '../types/game.ts';
import { Play, UserPlus, Trophy, Settings, Users, Radio, Shield, Globe, BookOpen } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface TitleScreenProps {
  agentProfile: AgentProfile;
  hasActiveCase: boolean;
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenProfile: () => void;
  onOpenRanking: () => void;
  onOpenSettings: () => void;
  onOpenMultiplayer: () => void;
  onOpenManual: () => void;
  reduceMotion?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  agentProfile,
  hasActiveCase,
  onStartNewGame,
  onResumeGame,
  onOpenProfile,
  onOpenRanking,
  onOpenSettings,
  onOpenMultiplayer,
  onOpenManual,
  reduceMotion = false,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
      {/* Background Rotating Tactical Globe Canvas / SVG */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 overflow-hidden">
        <div className={`relative w-[600px] h-[600px] rounded-full border border-cyan-500/20 flex items-center justify-center shrink-0 ${
          reduceMotion ? '' : 'animate-[spin_60s_linear_infinite]'
        }`}>
          {/* Concentric Radar Circles */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-cyan-500/10"></div>
          <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/15"></div>
          <div className="absolute w-[180px] h-[180px] rounded-full border border-cyan-500/20"></div>

          {/* Meridian lines */}
          <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
          <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>

          {/* Random pulsing dots across the globe nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        </div>
      </div>

      {/* Main Title Container */}
      <div className="relative z-10 max-w-xl w-full text-center space-y-6">
        {/* Confidencial Header Transmission Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-sm shadow-lg shadow-cyan-950/50 backdrop-blur-md">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase font-semibold">
            Transmissão Confidencial
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white font-mono drop-shadow-2xl">
            AGENTE <span className="text-cyan-400">X</span>
          </h1>
          <div className="text-base sm:text-lg font-bold tracking-widest text-slate-300 uppercase font-mono">
            Operações Internacionais
          </div>
        </div>

        {/* Cinematic Tagline (Rule 42) */}
        <p className="text-base sm:text-lg text-slate-300 font-mono italic max-w-lg mx-auto leading-relaxed border-y border-slate-800/80 py-4">
          "O mundo é grande. As pistas são pequenas. Encontre a verdade antes que o tempo acabe."
        </p>

        {/* Agent Quick Badge Card */}
        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenProfile();
          }}
          className="inline-flex items-center gap-3.5 p-3 px-5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-xl cursor-pointer transition-all font-mono shadow-md"
        >
          <span className="text-3xl">{agentProfile.avatarUrl ? '📷' : agentProfile.emoji}</span>
          <div className="text-left">
            <div className="font-bold text-slate-100 text-sm sm:text-base">
              {agentProfile.codename} {agentProfile.flag}
            </div>
            <div className="text-xs text-cyan-400">
              {agentProfile.rank} · {agentProfile.experience} XP
            </div>
          </div>
          <span className="text-xs text-slate-400 underline ml-2">Dossiê ➔</span>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col gap-3 max-w-md mx-auto pt-2 font-mono">
          {hasActiveCase && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onResumeGame();
              }}
              className="w-full py-3.5 px-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Continuar Investigação em Andamento
            </button>
          )}

          <button
            onClick={() => {
              audioEngine.playClick();
              onStartNewGame();
            }}
            className={`w-full py-3.5 px-6 font-bold text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
              hasActiveCase
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-xl shadow-cyan-950/60'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            {hasActiveCase ? 'Iniciar Nova Operação' : 'Iniciar Operação'}
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenProfile();
              }}
              className="py-3 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              Meu Agente
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenMultiplayer();
              }}
              className="py-3 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Multijogador
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenRanking();
              }}
              className="py-3 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Ranking Mundial
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenSettings();
              }}
              className="py-3 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Configurações
            </button>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenManual();
            }}
            className="w-full py-3 px-4 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            📖 Manual do Jogo (Regras & Dicas)
          </button>
        </div>
      </div>
    </div>
  );
};
