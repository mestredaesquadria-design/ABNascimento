import React from 'react';
import { GameSettings } from '../types/game.ts';
import { Settings, Volume2, VolumeX, Eye, Sparkles, Sliders, RotateCcw, X, Check } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface SettingsModalProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
  onResetProgress,
}) => {
  const [localSettings, setLocalSettings] = React.useState<GameSettings>({ ...settings });
  const [confirmReset, setConfirmReset] = React.useState(false);

  const toggle = (key: keyof GameSettings) => {
    setLocalSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      audioEngine.playClick();
      // Apply audio immediately
      if (key === 'soundMusic' || key === 'soundSfx' || key === 'voiceSynth') {
        audioEngine.setSettings(next.soundMusic, next.soundSfx, next.voiceSynth);
      }
      return next;
    });
  };

  const handleSave = () => {
    audioEngine.playSuccess();
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wider uppercase font-mono">
                Configurações & Acessibilidade
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Ajustes de áudio, interface e parâmetros do terminal
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

        <div className="p-4 sm:p-6 space-y-5 font-mono text-xs overflow-y-auto flex-1">
          {/* Audio Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
              Áudio e Atmosfera Tática
            </h4>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200">Música de Fundo (Suspense/Perseguição)</div>
                  <div className="text-[10px] text-slate-400">Trilha sintetizada procedimental da agência</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundMusic}
                  onChange={() => toggle('soundMusic')}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200">Efeitos Sonoros (SFX)</div>
                  <div className="text-[10px] text-slate-400">Radares, cliques táticos, alertas de perseguição</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundSfx}
                  onChange={() => toggle('soundSfx')}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200">Síntese de Voz (Leitura de Pistas)</div>
                  <div className="text-[10px] text-slate-400">Leitor de voz para relatórios e Mestre IA</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.voiceSynth}
                  onChange={() => toggle('voiceSynth')}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
              Acessibilidade Visual & Conforto
            </h4>

            <div className="space-y-2">
              {/* Font Size Selector */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <span>Tamanho da Fonte / Tipografia</span>
                      <span className="text-xs px-2 py-0.5 bg-cyan-950 border border-cyan-700/50 text-cyan-300 rounded-md font-mono">
                        {localSettings.fontSizeLevel === 'huge' ? 'Extra Grande' : localSettings.fontSizeLevel === 'normal' && !localSettings.largeFont ? 'Normal' : 'Grande (Ativo)'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">Aumente para leitura confortável dos relatórios e pistas</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, fontSizeLevel: 'normal', largeFont: false }));
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      (localSettings.fontSizeLevel === 'normal' && !localSettings.largeFont)
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    A Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, fontSizeLevel: 'large', largeFont: true }));
                    }}
                    className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                      (!localSettings.fontSizeLevel || localSettings.fontSizeLevel === 'large' || (localSettings.largeFont && localSettings.fontSizeLevel !== 'huge'))
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    A+ Grande
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, fontSizeLevel: 'huge', largeFont: true }));
                    }}
                    className={`py-2 px-3 rounded-lg border text-base font-bold transition-all ${
                      localSettings.fontSizeLevel === 'huge'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    A++ Extra
                  </button>
                </div>
              </div>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200">Modo Alto Contraste</div>
                  <div className="text-xs text-slate-400">Aumenta a nitidez de textos e bordas</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.highContrast}
                  onChange={() => toggle('highContrast')}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200">Reduzir Animações</div>
                  <div className="text-[10px] text-slate-400">Desativa pulsações de radar e transições rápidas</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.reduceMotion}
                  onChange={() => toggle('reduceMotion')}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-[10px]">Apagar tudo?</span>
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playWrong();
                    onResetProgress();
                  }}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded"
                >
                  Confirmar Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="text-slate-400 hover:text-slate-200 text-[10px]"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetar Dados Salvos
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/30 font-mono"
            >
              <Check className="w-4 h-4" />
              Aplicar Ajustes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
