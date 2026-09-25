import React, { useState } from 'react';
import { MissionResult } from '../types/game.ts';
import { formatMissionTime } from '../services/proceduralGenerator.ts';
import { BookOpen, CheckCircle, AlertTriangle, Shield, Clock, Search, FolderArchive } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface ArchivedCasesViewProps {
  solvedCases: MissionResult[];
  archivedCases: MissionResult[];
}

export const ArchivedCasesView: React.FC<ArchivedCasesViewProps> = ({
  solvedCases,
  archivedCases,
}) => {
  const [tab, setTab] = useState<'solved' | 'failed'>('solved');
  const [selectedCase, setSelectedCase] = useState<MissionResult | null>(
    solvedCases[0] || archivedCases[0] || null
  );

  const currentList = tab === 'solved' ? solvedCases : archivedCases;

  return (
    <div className="bg-slate-900 border border-cyan-900/40 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with Title and Tabs */}
      <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <FolderArchive className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base font-mono tracking-wider uppercase">
              Arquivo Confidencial de Casos
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Registros históricos de investigações resolvidas e operações arquivadas
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setTab('solved');
              setSelectedCase(solvedCases[0] || null);
              audioEngine.playClick();
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'solved'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Resolvidos ({solvedCases.length})
          </button>

          <button
            onClick={() => {
              setTab('failed');
              setSelectedCase(archivedCases[0] || null);
              audioEngine.playClick();
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'failed'
                ? 'bg-red-950/80 text-red-300 border border-red-800/60 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Arquivados / Falhas ({archivedCases.length})
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6">
        {currentList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            Nenhum dossiê registrado nesta pasta de arquivo até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* List */}
            <div className="md:col-span-5 space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {currentList.map((item) => {
                const isSelected = selectedCase?.caseId === item.caseId;
                return (
                  <div
                    key={item.caseId}
                    onClick={() => {
                      setSelectedCase(item);
                      audioEngine.playClick();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all font-mono text-xs ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-md'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-100">{item.operationName}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{item.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>ID: {item.caseId}</span>
                      <span className="text-cyan-400">{item.score.toLocaleString()} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected File Dossier Sheet */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-4">
              {selectedCase ? (
                <>
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">
                        Dossiê Arquivado Oficial
                      </span>
                      <h4 className="text-base font-bold text-slate-100 mt-0.5">
                        {selectedCase.operationName}
                      </h4>
                      <p className="text-[11px] text-slate-400">Código de Referência: {selectedCase.caseId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${
                      selectedCase.success
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                        : 'bg-red-950/60 border-red-800 text-red-400'
                    }`}>
                      {selectedCase.success ? 'RESOLVIDO' : 'ARQUIVADO'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Agente Responsável:</span>
                      <span className="text-slate-200 font-bold">{selectedCase.agentCodename}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Data do Fechamento:</span>
                      <span className="text-slate-200">{new Date(selectedCase.solvedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tempo Total:</span>
                      <span className="text-purple-400 font-bold">{formatMissionTime(selectedCase.totalMinutes)} h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Precisão:</span>
                      <span className="text-amber-400 font-bold">{selectedCase.accuracy}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="text-slate-500 text-[10px] uppercase">Itinerário de Perseguição:</div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 font-bold">
                      {selectedCase.destinationsVisited.join(' ➔ ')}
                    </div>
                  </div>

                  {!selectedCase.success && selectedCase.failureReason && (
                    <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-lg text-red-300 text-xs">
                      <span className="font-bold block mb-1">Motivo do Arquivamento:</span>
                      {selectedCase.failureReason}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-slate-500 text-[10px]">
                    <span>Pistas Coletadas: {selectedCase.cluesUsedCount}/{selectedCase.totalCluesCount}</span>
                    <span>Pontuação: {selectedCase.score.toLocaleString()} pts</span>
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-center py-10">
                  Selecione um caso para visualizar os autos confidenciais.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
