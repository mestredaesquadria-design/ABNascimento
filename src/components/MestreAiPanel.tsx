import React, { useState } from 'react';
import { Bot, Lightbulb, Sparkles, AlertCircle, Volume2 } from 'lucide-react';
import { ApiClient } from '../services/apiClient.ts';
import { audioEngine } from '../services/audioService.ts';

interface MestreAiPanelProps {
  currentCity: string;
  nextCityName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recentClues: any[];
  hintsUsed: number;
  onHintRequested: () => void;
  voiceSynthEnabled?: boolean;
}

export const MestreAiPanel: React.FC<MestreAiPanelProps> = ({
  currentCity,
  nextCityName,
  difficulty,
  recentClues,
  hintsUsed,
  onHintRequested,
  voiceSynthEnabled = true,
}) => {
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Maximum hints allowed based on difficulty (hard allows fewer hints)
  const maxHints = difficulty === 'easy' ? 99 : difficulty === 'medium' ? 5 : 2;
  const hintsRemaining = Math.max(0, maxHints - hintsUsed);

  const handleRequestHint = async (level: 1 | 2 | 3) => {
    if (hintsRemaining <= 0) {
      audioEngine.playWrong();
      return;
    }

    setLoading(true);
    setHintLevel(level);
    audioEngine.playRadarPing();
    onHintRequested();

    try {
      const hint = await ApiClient.getMestreHint(currentCity, nextCityName, level, recentClues);
      setCurrentHint(hint);
      audioEngine.playSuccess();
    } catch (e) {
      setCurrentHint('Mestre IA: Mantenha a atenção aos registros de câmbio e depoimentos de testemunhas de embarque.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    audioEngine.speakText(text);
  };

  return (
    <div className="bg-slate-900 border border-purple-900/40 rounded-xl overflow-hidden shadow-xl">
      <div className="p-3.5 bg-slate-950 border-b border-purple-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-slate-100 text-xs font-mono tracking-wider uppercase">
            Mestre IA — Central Tática
          </h4>
        </div>
        <div className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
          {difficulty === 'hard' ? `Dicas Restantes: ${hintsRemaining}` : 'Suporte Ativo'}
        </div>
      </div>

      <div className="p-4 space-y-3 font-mono text-xs">
        <p className="text-slate-400 text-[11px] leading-relaxed">
          O Mestre IA atua como diretor consultor. Ele analisa correlações sem quebrar o desafio da dedução.
        </p>

        {currentHint ? (
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg text-purple-100 relative">
            <div className="flex items-center justify-between text-[10px] text-purple-400 mb-1">
              <span className="font-bold uppercase">Orientação de Nível {hintLevel}</span>
              {voiceSynthEnabled && (
                <button
                  onClick={() => handleSpeak(currentHint)}
                  className="p-1 text-purple-300 hover:text-white"
                  title="Ouvir orientações"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="leading-relaxed">{currentHint}</p>
          </div>
        ) : (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-500 text-center">
            Selecione a intensidade da orientação tática desejada.
          </div>
        )}

        {/* Gradual Hint Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleRequestHint(1)}
            disabled={loading || hintsRemaining <= 0}
            className="p-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 hover:border-purple-800 text-slate-300 hover:text-purple-300 rounded-lg transition-colors text-[10px] text-center"
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
            <span className="font-bold block">Nível 1</span>
            <span className="text-slate-500 text-[9px] block">Geral</span>
          </button>

          <button
            onClick={() => handleRequestHint(2)}
            disabled={loading || hintsRemaining <= 0}
            className="p-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 hover:border-purple-800 text-slate-300 hover:text-purple-300 rounded-lg transition-colors text-[10px] text-center"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span className="font-bold block">Nível 2</span>
            <span className="text-slate-500 text-[9px] block">Específica</span>
          </button>

          <button
            onClick={() => handleRequestHint(3)}
            disabled={loading || hintsRemaining <= 0}
            className="p-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 hover:border-purple-800 text-slate-300 hover:text-purple-300 rounded-lg transition-colors text-[10px] text-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
            <span className="font-bold block">Nível 3</span>
            <span className="text-slate-500 text-[9px] block">Foco Rota</span>
          </button>
        </div>

        {hintsRemaining <= 0 && difficulty === 'hard' && (
          <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Limite de ajuda do Mestre IA atingido para este caso Difícil.</span>
          </div>
        )}
      </div>
    </div>
  );
};
