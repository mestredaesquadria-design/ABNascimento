import React, { useState } from 'react';
import { Users, Swords, Globe2, ShieldCheck, Check, Sparkles, X } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface MultiplayerModalProps {
  onClose: () => void;
  onStartMode: (mode: '1vs1' | 'coop' | 'global', role?: string) => void;
}

const COOP_ROLES = [
  { id: 'investigator', title: '🔎 Investigador Chefe', desc: 'Foco na coleta e validação das pistas primárias e vestígios' },
  { id: 'tracker', title: '🌎 Rastreador Global', desc: 'Especialista em rotas aéreas, cálculo de fusos e previsão de fuga' },
  { id: 'analyst', title: '📁 Analista Criptográfico', desc: 'Descriptografia de sinais interceptados e autenticação de documentos' },
  { id: 'interrogator', title: '🕵️ Interrogador Tático', desc: 'Obtenção de depoimentos decisivos e confronto de evidências' },
];

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  onClose,
  onStartMode,
}) => {
  const [selectedMode, setSelectedMode] = useState<'1vs1' | 'coop' | 'global'>('1vs1');
  const [selectedRole, setSelectedRole] = useState<string>('investigator');

  const handleStart = () => {
    audioEngine.playSuccess();
    onStartMode(selectedMode, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wider uppercase font-mono">
                Rede de Operações Multijogador
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Conecte-se com agentes da Interpol e agências aliadas
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
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedMode('1vs1');
                audioEngine.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
                selectedMode === '1vs1'
                  ? 'border-cyan-400 bg-cyan-950/50 shadow-md ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <Swords className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-bold text-xs text-slate-100">1 VS 1 Tático</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Duelo direto contra agente rival no mesmo caso internacional.
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('coop');
                audioEngine.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
                selectedMode === 'coop'
                  ? 'border-cyan-400 bg-cyan-950/50 shadow-md ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <Users className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-xs text-slate-100">Cooperativo</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Até 4 agentes com papéis táticos especializados em equipe.
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('global');
                audioEngine.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
                selectedMode === 'global'
                  ? 'border-cyan-400 bg-cyan-950/50 shadow-md ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <Globe2 className="w-5 h-5 text-purple-400 mb-2" />
              <div className="font-bold text-xs text-slate-100">Desafio Global</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Operação diária mundial com placar unificado na rede.
              </div>
            </button>
          </div>

          {/* If Coop: Select Role */}
          {selectedMode === 'coop' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                Selecione sua Função na Equipe Tática:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COOP_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id);
                        audioEngine.playClick();
                      }}
                      className={`p-3 rounded-lg border text-left transition-all font-mono text-xs ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-100">{role.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{role.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode Rules Summary */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-1.5">
            <span className="text-cyan-400 font-bold block mb-1">PARÂMETROS DA OPERAÇÃO:</span>
            {selectedMode === '1vs1' && (
              <p>• Oponente simulado em tempo real. Ambos partem com cronômetro idêntico de 20 minutos.</p>
            )}
            {selectedMode === 'coop' && (
              <p>• Bônus cooperativo: Pistas criptográficas e conexões aéreas são compartilhadas instantaneamente.</p>
            )}
            {selectedMode === 'global' && (
              <p>• Semente unificada: Todos os agentes do globo recebem o mesmo caso internacional com ranking registrado.</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/30 font-mono"
            >
              <Check className="w-4 h-4" />
              Mobilizar Operação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
