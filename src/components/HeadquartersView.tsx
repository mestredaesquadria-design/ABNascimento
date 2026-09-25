import React from 'react';
import { AgentProfile, CaseData } from '../types/game.ts';
import { formatMissionTime } from '../services/proceduralGenerator.ts';
import { Shield, Play, Globe, Search, User, Trophy, BookOpen, Settings, Bot, Users, AlertCircle, Radio } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface HeadquartersViewProps {
  profile: AgentProfile;
  activeCase: CaseData | null;
  onNewOperation: () => void;
  onResumeInvestigation: () => void;
  onOpenMap: () => void;
  onOpenProfile: () => void;
  onOpenRanking: () => void;
  onOpenArchives: () => void;
  onOpenSettings: () => void;
  onOpenMultiplayer: () => void;
  onOpenManual: () => void;
}

export const HeadquartersView: React.FC<HeadquartersViewProps> = ({
  profile,
  activeCase,
  onNewOperation,
  onResumeInvestigation,
  onOpenMap,
  onOpenProfile,
  onOpenRanking,
  onOpenArchives,
  onOpenSettings,
  onOpenMultiplayer,
  onOpenManual,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Threat Level & Agency Banner */}
      <div className="bg-slate-900/90 border border-cyan-900/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                  QG Central de Operações Estratégicas
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-100 mt-1">
                Bem-vindo à Central, {profile.codename}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Patente: <strong className="text-amber-400">{profile.rank}</strong> · {profile.nationality} {profile.flag} · {profile.experience} XP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeCase ? (
              <>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onNewOperation();
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  Nova Operação
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onResumeInvestigation();
                  }}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Continuar Investigação
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onNewOperation();
                }}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Nova Operação
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Mission Spotlight if available */}
      {activeCase && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-xl font-mono text-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 uppercase">
                Operação em Andamento: {activeCase.operationName}
              </span>
            </div>
            <span className="text-slate-400">ID: {activeCase.id}</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {activeCase.briefing}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="bg-slate-950 p-2 rounded">
              <span className="text-slate-500 block text-[10px]">Suspeito:</span>
              <span className="text-slate-200 font-bold">{activeCase.suspect.name}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded">
              <span className="text-slate-500 block text-[10px]">Codinome:</span>
              <span className="text-cyan-400 font-bold">"{activeCase.suspect.codename}"</span>
            </div>
            <div className="bg-slate-950 p-2 rounded">
              <span className="text-slate-500 block text-[10px]">Dificuldade:</span>
              <span className="text-amber-400 uppercase font-bold">{activeCase.difficulty}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded">
              <span className="text-slate-500 block text-[10px]">Destinos do Caso:</span>
              <span className="text-purple-400 font-bold">6 Cidades Internacionais</span>
            </div>
          </div>
        </div>
      )}

      {/* Central Terminal Command Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div
          onClick={() => {
            audioEngine.playClick();
            onNewOperation();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">📁 Nova Operação</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Selecione dificuldade e encare as 30 etapas da campanha ou o Modo Mestre.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenMap();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">🌎 Mapa Mundial</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Acesse o radar tático e consulte rotas aéreas e entroncamentos internacionais.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenProfile();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">🪪 Meu Agente</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Consulte seu dossiê, medalhas, progressão de patente e tempo recorde.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenRanking();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">🏆 Ranking dos Agentes</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Tabela de classificação internacional com agentes do mundo todo.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenArchives();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">📚 Casos Arquivados</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Biblioteca de operações concluídas e investigações encerradas por tempo.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenMultiplayer();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">👥 Multijogador</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Modo 1 vs 1, equipes cooperativas de 4 agentes e Desafio Global diário.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenSettings();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-slate-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">⚙️ Configurações</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Música de suspense, efeitos sonoros, voz TTS e recursos de acessibilidade.
          </p>
        </div>

        <div
          onClick={() => {
            audioEngine.playClick();
            onOpenManual();
          }}
          className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">📖 Manual do Jogo</h4>
          <p className="text-slate-400 text-[11px] mt-1">
            Regras, guia de pistas, tabela de patentes, dicas e protocolo de captura.
          </p>
        </div>
      </div>
    </div>
  );
};
