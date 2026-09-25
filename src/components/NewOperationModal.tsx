import React, { useState } from 'react';
import { DifficultyLevel } from '../types/game.ts';
import { Shield, Sparkles, Target, Lock, CheckCircle2, Award, Zap, X } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface NewOperationModalProps {
  unlockedStages: number;
  onSelectOperation: (difficulty: DifficultyLevel, stageNumber: number, isMasterMode: boolean) => void;
  onClose: () => void;
  isGenerating: boolean;
}

const CAMPAIGN_STAGES = [
  { stage: 1, title: 'Treinamento do Recruta', desc: 'Primeiro caso para dominar o cruzamento de dados de transporte.' },
  { stage: 2, title: 'Primeira Investigação Internacional', desc: 'Rastreamento transatlântico de artefatos raros.' },
  { stage: 3, title: 'Múltiplas Testemunhas', desc: 'Filtrar depoimentos cruzados e detectar contradições.' },
  { stage: 4, title: 'Operação de Documentos Secretos', desc: 'Análise aprofundada de cartões de embarque e passaportes.' },
  { stage: 5, title: 'Perseguição Transcontinental', desc: 'O suspeito acelera o ritmo e viaja por fusos horários extremos.' },
  { stage: 6, title: 'Informações Conflitantes', desc: 'Rotas falsas deixadas intencionalmente para despistar a Agência.' },
  { stage: 7, title: 'Infiltração de Alta Complexidade', desc: 'Criptografia militar e terminais bancários protegidos.' },
  { stage: 8, title: 'Alerta de Alta Prioridade', desc: 'Itens de segurança internacional em risco iminente.' },
  { stage: 9, title: 'Operação Global Integrada', desc: 'A maior rede de apoio logístico mobilizada pela Interpol.' },
  { stage: 10, title: 'GRANDE OPERAÇÃO FINAL', desc: 'O confronto supremo contra o sindicato internacional.' },
];

export const NewOperationModal: React.FC<NewOperationModalProps> = ({
  unlockedStages,
  onSelectOperation,
  onClose,
  isGenerating,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [isMasterMode, setIsMasterMode] = useState<boolean>(false);

  const canPlayMasterMode = unlockedStages >= 10;

  const handleLaunch = () => {
    audioEngine.playSuccess();
    onSelectOperation(difficulty, selectedStage, isMasterMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wider uppercase font-mono">
                Iniciar Nova Operação Mundial
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Selecione o nível de rigor tático e a etapa da campanha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Difficulty Cards */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              Nível de Dificuldade da Missão:
            </label>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setDifficulty('easy');
                  audioEngine.playClick();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'easy'
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <span>🟢 FÁCIL</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">3 etapas progressivas</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  3 destinos na rota. Pistas diretas ideais para iniciar a carreira.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDifficulty('medium');
                  audioEngine.playClick();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'medium'
                    ? 'border-amber-500 bg-amber-950/40 shadow-md ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <span>🟡 MÉDIO</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">5 etapas progressivas</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  5 destinos na rota. Rastreamento por moedas, culturas e conexões.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDifficulty('hard');
                  audioEngine.playClick();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'hard'
                    ? 'border-red-500 bg-red-950/40 shadow-md ring-1 ring-red-500'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                  <span>🔴 DIFÍCIL</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">7 etapas progressivas</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  7 destinos na rota. Enigmas profundos e perseguição transcontinental.
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Desafio extremo de memória, ambiguidade e tempo rigoroso.
                </p>
              </button>
            </div>
          </div>

          {/* Master Mode Toggle Card */}
          <div
            onClick={() => {
              if (canPlayMasterMode) {
                setIsMasterMode(!isMasterMode);
                audioEngine.playClick();
              }
            }}
            className={`p-4 rounded-xl border font-mono text-xs transition-all ${
              !canPlayMasterMode
                ? 'opacity-60 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                : isMasterMode
                ? 'bg-purple-950/50 border-purple-500 cursor-pointer ring-1 ring-purple-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-bold text-slate-100">🏆 MODO MESTRE — CASOS ILIMITADOS COM IA</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Gera casos procedurais infinitos sem limites de campanha.
                  </p>
                </div>
              </div>
              <div>
                {!canPlayMasterMode ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bloqueado (Requer 10 etapas)
                  </span>
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    isMasterMode ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isMasterMode ? 'ATIVADO' : 'DESATIVADO'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Stage Selector */}
          {!isMasterMode && (
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Etapa da Campanha:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                {CAMPAIGN_STAGES.map((s) => {
                  const isLocked = s.stage > unlockedStages;
                  const isSelected = selectedStage === s.stage;

                  return (
                    <button
                      type="button"
                      key={s.stage}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedStage(s.stage);
                        audioEngine.playClick();
                      }}
                      className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 font-bold'
                          : isLocked
                          ? 'border-slate-800/40 bg-slate-950/30 text-slate-600 cursor-not-allowed'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5">Etapa {s.stage}</div>
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 mx-auto text-slate-600" />
                      ) : (
                        <div className="truncate font-bold text-[11px] text-slate-200">
                          {s.stage === 10 ? '⭐ FINAL' : `#${s.stage}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Description Preview */}
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs">
                <span className="text-cyan-400 font-bold block mb-0.5">
                  Etapa {selectedStage}: {CAMPAIGN_STAGES[selectedStage - 1].title}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {CAMPAIGN_STAGES[selectedStage - 1].desc}
                </p>
              </div>
            </div>
          )}

          {/* Launch Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleLaunch}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/30 font-mono cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Carregando Operação...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Carregar Operação</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
