import React, { useState } from 'react';
import { Witness, CaseDocument } from '../types/game.ts';
import { UserCheck, MessageSquare, Send, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { ApiClient } from '../services/apiClient.ts';
import { audioEngine } from '../services/audioService.ts';

interface WitnessRoomProps {
  witness: Witness;
  suspectName: string;
  city: string;
  evidenceDoc?: CaseDocument;
  onQuestionAsked?: (timeMinutesCost: number) => void;
  interrogationLog: Array<{ sender: string; role?: string; text: string; time: string }>;
  onAddLog: (entry: { sender: string; role?: string; text: string; time: string }) => void;
}

export const WitnessRoom: React.FC<WitnessRoomProps> = ({
  witness,
  suspectName,
  city,
  evidenceDoc,
  onQuestionAsked,
  interrogationLog,
  onAddLog,
}) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (questionText: string, isEvidence: boolean = false) => {
    if (!questionText.trim()) return;
    audioEngine.playTeletype();
    setLoading(true);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add user question to log
    onAddLog({
      sender: 'Agente X',
      text: questionText,
      time: timeStr,
    });

    if (onQuestionAsked) {
      onQuestionAsked(10); // costs 10 mins of mission investigation time
    }

    try {
      const reply = await ApiClient.interrogateWitness(
        suspectName,
        witness,
        questionText,
        isEvidence ? evidenceDoc : undefined,
        city
      );

      audioEngine.playRadarPing();
      onAddLog({
        sender: witness.name,
        role: witness.role,
        text: reply,
        time: timeStr,
      });
    } catch (err) {
      onAddLog({
        sender: witness.name,
        role: witness.role,
        text: witness.statement,
        time: timeStr,
      });
    } finally {
      setLoading(false);
      setCustomQuestion('');
    }
  };

  return (
    <div className="bg-slate-900 border border-cyan-900/40 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Witness Header Banner */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-sm font-mono">{witness.name}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                {city}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{witness.role}</p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500 text-right">
          <span>SALA DE INTERROGATÓRIO</span>
          <span className="block text-emerald-400">GRAVAÇÃO ATIVA</span>
        </div>
      </div>

      {/* Initial Statement / Dialogue Feed */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/60 font-mono text-xs">
        {/* Witness intro quote */}
        <div className="p-3 bg-slate-900/90 border-l-2 border-cyan-500 rounded-r-lg text-slate-200">
          <span className="text-[10px] text-cyan-400 font-bold block mb-1 uppercase">
            Depoimento Preliminar:
          </span>
          "{witness.statement}"
        </div>

        {/* Dynamic interrogation history */}
        {interrogationLog.map((item, idx) => {
          const isAgent = item.sender === 'Agente X';
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[85%] ${
                isAgent
                  ? 'ml-auto bg-cyan-950/70 border border-cyan-800/50 text-cyan-100'
                  : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-1">
                <span className={isAgent ? 'text-cyan-400 font-bold' : 'text-slate-300 font-bold'}>
                  {item.sender} {item.role ? `(${item.role})` : ''}
                </span>
                <span>{item.time}</span>
              </div>
              <p className="leading-relaxed">{item.text}</p>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs p-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Testemunha prestando depoimento formal...
          </div>
        )}
      </div>

      {/* Interrogation Controls */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => askQuestion(witness.question1)}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-cyan-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            "Para onde ele pretendia viajar?"
          </button>

          <button
            onClick={() => askQuestion(witness.question2)}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-cyan-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            "Havia algo chamativo na aparência dele?"
          </button>

          {evidenceDoc && (
            <button
              onClick={() => askQuestion(`Apresento este documento formal: ${evidenceDoc.title}. Você o reconhece?`, true)}
              disabled={loading}
              className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Apresentar Evidência
            </button>
          )}
        </div>

        {/* Custom Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askQuestion(customQuestion);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            disabled={loading}
            placeholder="Digite uma pergunta tática personalizada para a testemunha..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !customQuestion.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Perguntar
          </button>
        </form>
      </div>
    </div>
  );
};
