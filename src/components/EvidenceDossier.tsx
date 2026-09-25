import React, { useState } from 'react';
import { CaseDocument, Clue } from '../types/game.ts';
import { FileText, Plane, ShieldAlert, Lock, Unlock, KeyRound, Eye, CheckCircle, Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface EvidenceDossierProps {
  clues: Clue[];
  document?: CaseDocument;
  onClueDiscovered?: (clueId: string) => void;
  voiceSynthEnabled?: boolean;
}

export const EvidenceDossier: React.FC<EvidenceDossierProps> = ({
  clues,
  document,
  onClueDiscovered,
  voiceSynthEnabled = true,
}) => {
  const [selectedClue, setSelectedClue] = useState<Clue | null>(clues[0] || null);
  const [cipherDecrypted, setCipherDecrypted] = useState(false);
  const [cipherInput, setCipherInput] = useState('');
  const [activeTab, setActiveTab] = useState<'clues' | 'document' | 'cipher'>('clues');

  const handleSelectClue = (clue: Clue) => {
    setSelectedClue(clue);
    audioEngine.playClick();
    if (onClueDiscovered) {
      onClueDiscovered(clue.id);
    }
  };

  const handleSpeakClue = (text: string) => {
    audioEngine.speakText(text);
  };

  const handleVerifyCipher = (e: React.FormEvent) => {
    e.preventDefault();
    if (cipherInput.trim().toUpperCase().includes('X') || cipherInput.trim().length >= 3) {
      setCipherDecrypted(true);
      audioEngine.playSuccess();
    } else {
      audioEngine.playWrong();
    }
  };

  return (
    <div className="bg-slate-900 border border-cyan-900/40 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Dossier Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 text-xs font-mono">
        <button
          onClick={() => {
            setActiveTab('clues');
            audioEngine.playClick();
          }}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'clues'
              ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Pistas Coletadas ({clues.length})
        </button>

        {document && (
          <button
            onClick={() => {
              setActiveTab('document');
              audioEngine.playClick();
            }}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'document'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            Documento Apreendido
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('cipher');
            audioEngine.playClick();
          }}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'cipher'
              ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Terminal Criptográfico
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'clues' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* Clues List */}
            <div className="md:col-span-5 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                Índice de Evidências Locais
              </span>
              {clues.map((clue, idx) => {
                const isSelected = selectedClue?.id === clue.id;
                return (
                  <div
                    key={clue.id}
                    onClick={() => handleSelectClue(clue)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 shadow-md'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-bold">
                        Pista #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        {clue.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium truncate mt-1">
                      {clue.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Clue Inspector */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              {selectedClue ? (
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        {selectedClue.source}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                        {selectedClue.title}
                      </h4>
                    </div>
                    {voiceSynthEnabled && (
                      <button
                        onClick={() => handleSpeakClue(selectedClue.text)}
                        title="Ouvir leitura da pista"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-800 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-slate-900/90 border-l-2 border-cyan-500 rounded text-slate-200 text-xs font-mono leading-relaxed mb-4">
                    "{selectedClue.text}"
                  </div>

                  {selectedClue.hintToNextCity && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-950/20 border border-amber-900/30 p-2 rounded">
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span>Contém referência de rota ou destino geográfico importante.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 flex items-center justify-center h-full">
                  Selecione uma pista para inspeção forense detalhada.
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800 flex justify-between">
                <span>CLASSIFICAÇÃO: CONFIDENCIAL</span>
                <span>STATUS: VERIFICADO</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Document */}
        {activeTab === 'document' && document && (
          <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {document.issuer}
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-0.5">{document.title}</h4>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-500 block">Série:</span>
                <span className="text-cyan-400 font-bold">{document.serialNumber || 'DOC-7729'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed mb-4">
              {document.content}
            </div>

            {document.details && (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 mb-4">
                {Object.entries(document.details).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-500 block text-[10px]">{k}:</span>
                    <span className="text-slate-200 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Evidência autêntica custodiada pelo cofre da Agência.</span>
            </div>
          </div>
        )}

        {/* Tab Cipher Mini-Puzzle */}
        {activeTab === 'cipher' && (
          <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm font-mono">
                    Descriptografia de Sinal Interceptado
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Transmissão codificada captada pelos satélites da Agência
                  </p>
                </div>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                cipherDecrypted
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                  : 'border-amber-500/50 bg-amber-950/40 text-amber-400'
              }`}>
                {cipherDecrypted ? 'DESCRIPTOGRAFADO' : 'SINAL PROTEGIDO'}
              </span>
            </div>

            {cipherDecrypted ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                  <Unlock className="w-4 h-4" />
                  <span>CÓDIGO RESOLVIDO — DADOS REVELADOS</span>
                </div>
                <p className="text-xs font-mono text-slate-300">
                  "Relatório decifrado: O suspeito confirmou que não pretende recuar e que as pistas que ele deixou para trás foram propositalmente minimizadas. Fique atento às menções de monumentos históricos e divisas bancárias."
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
                  <div className="text-[10px] text-slate-500 mb-1">PACOTE HEXADECIMAL BRUTO:</div>
                  41 47 45 4E 54 45 2D 58 20 44 45 43 4F 44 45 20 53 49 47 4E 41 4C
                  <div className="text-[11px] text-slate-400 mt-2">
                    Dica criptográfica: Digite qualquer termo-chave da Agência (ex: "X", "AGENTE" ou o codinome do suspeito) para forçar o bypass do firewall quântico.
                  </div>
                </div>

                <form onSubmit={handleVerifyCipher} className="flex gap-2">
                  <input
                    type="text"
                    value={cipherInput}
                    onChange={(e) => setCipherInput(e.target.value)}
                    placeholder="Chave de descriptografia..."
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Decodificar
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
