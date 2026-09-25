import React from 'react';
import { MissionResult, AgentRank } from '../types/game.ts';
import { formatMissionTime } from '../services/proceduralGenerator.ts';
import { Trophy, AlertTriangle, Award, ArrowRight, BookOpen, BarChart3, Home, CheckCircle2, XCircle } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface MissionResultViewProps {
  result: MissionResult;
  onNextMission: () => void;
  onViewArchives: () => void;
  onViewRanking: () => void;
  onBackToHq: () => void;
}

export const MissionResultView: React.FC<MissionResultViewProps> = ({
  result,
  onNextMission,
  onViewArchives,
  onViewRanking,
  onBackToHq,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Result Hero Header */}
      <div className={`p-6 border-b text-center relative overflow-hidden ${
        result.success 
          ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-900/60'
          : 'bg-gradient-to-b from-red-950/80 to-slate-900 border-red-900/60'
      }`}>
        <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-3 shadow-inner bg-slate-950/60 border border-white/10">
          {result.success ? (
            <Trophy className="w-10 h-10 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-red-400" />
          )}
        </div>

        <h2 className="text-2xl font-black font-mono tracking-wider uppercase text-slate-100">
          {result.success ? '🏆 Operação Concluída com Sucesso' : '🚨 Operação Encerrada — Suspeito Escapou'}
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-1">
          {result.operationName} · ID: {result.caseId}
        </p>

        {/* Promotion Announcement if promoted */}
        {result.promotedToRank && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-xs animate-bounce shadow-lg">
            <Award className="w-4 h-4 text-amber-400" />
            <span>PROMOÇÃO EXTRAORDINÁRIA: Agora você é <strong>{result.promotedToRank.toUpperCase()}</strong>!</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Score and XP Highlight Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Pontuação Final</span>
            <span className="text-xl font-bold text-cyan-400">
              {result.score.toLocaleString()} pts
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Experiência (XP)</span>
            <span className="text-xl font-bold text-emerald-400">
              +{result.experienceEarned} XP
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Precisão Global</span>
            <span className="text-xl font-bold text-amber-400">
              {result.accuracy}%
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Tempo Total</span>
            <span className="text-xl font-bold text-purple-400">
              {formatMissionTime(result.totalMinutes)} h
            </span>
          </div>
        </div>

        {/* Tactical Breakdown Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2.5">
          <h4 className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-2">
            Métricas de Investigação e Deslocamento
          </h4>

          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Tempo de Viagens Internacionais:</span>
            <span className="text-slate-200">{formatMissionTime(result.travelMinutes)} h</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Tempo de Interrogatório e Perícia:</span>
            <span className="text-slate-200">{formatMissionTime(result.investigationMinutes)} h</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Pistas Cruciais Utilizadas:</span>
            <span className="text-slate-200">{result.cluesUsedCount} de {result.totalCluesCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Destinos Internacionais Varridos:</span>
            <span className="text-cyan-400 font-bold">{result.destinationsVisited.join(' ➔ ')}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Grau de Complexidade:</span>
            <span className="text-amber-400 uppercase font-bold">{result.difficulty}</span>
          </div>

          {!result.success && result.failureReason && (
            <div className="p-2.5 bg-red-950/40 border border-red-800/40 rounded text-red-300 text-[11px] mt-2">
              Motivo do Arquivamento: {result.failureReason}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              onBackToHq();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Central da Agência
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                onViewRanking();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Ranking
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onViewArchives();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Casos Arquivados
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onNextMission();
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/40"
            >
              Próxima Operação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
