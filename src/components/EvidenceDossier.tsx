import React, { useState } from 'react';
import { CaseDocument, Clue } from '../types/game.ts';
import { FileText, Plane, ShieldAlert, Lock, Unlock, KeyRound, Eye, CheckCircle, Volume2, Search, History, AlertCircle } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface EvidenceDossierProps {
  currentClue?: Clue;
  clues?: Clue[];
  currentStageIndex?: number;
  totalStages?: number;
  historyClues?: { stageNumber: number; cityName: string; clue: Clue }[];
  document?: CaseDocument;
  onClueDiscovered?: (clueId: string) => void;
  voiceSynthEnabled?: boolean;
}

export const EvidenceDossier: React.FC<EvidenceDossierProps> = ({
  currentClue,
  clues,
  currentStageIndex = 0,
  totalStages = 5,
  historyClues = [],
  document,
  onClueDiscovered,
  voiceSynthEnabled = true,
}) => {
  const effectiveClue: Clue = currentClue || (clues && clues[0]) || {
    id: 'clue-default',
    type: 'witness',
    title: 'Pista de Campo',
    text: 'Investigação em andamento no destino atual.',
    source: 'Agência',
    hintToNextCity: true,
  };
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'document' | 'cipher'>('current');
  const [selectedHistoryClue, setSelectedHistoryClue] = useState<Clue | null>(null);
  const [cipherDecrypted, setCipherDecrypted] = useState(false);
  const [cipherInput, setCipherInput] = useState('');

  const handleSpeak = (text: string) => {
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

  const isFinalStage = currentStageIndex >= totalStages - 1;

  return (
    <div className="bg-slate-900 border border-cyan-900/40 rounded-xl overflow-hidden shadow-xl flex flex-col h-full font-mono">
      
      {/* Dossier Navigation Header */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 text-xs overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('current');
            audioEngine.playClick();
          }}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'current'
              ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pista Atual (#{currentStageIndex + 1})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            audioEngine.playClick();
          }}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'history'
              ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Histórico ({historyClues.length})</span>
        </button>

        {document && (
          <button
            onClick={() => {
              setActiveTab('document');
              audioEngine.playClick();
            }}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'document'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Documento Apreendido</span>
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('cipher');
            audioEngine.playClick();
          }}
          className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'cipher'
              ? 'bg-slate-900 text-cyan-400 border-t border-x border-cyan-800/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Terminal Criptográfico</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        
        {/* 1. CURRENT PROGRESSIVE CLUE TAB */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            
            {/* Step Progression Bar */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Cadeia de Rastreamento</span>
                <span className="text-slate-200 font-bold text-sm">
                  Etapa {currentStageIndex + 1} de {totalStages} — {isFinalStage ? 'Destino Final' : 'Em Perseguição'}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: totalStages }).map((_, i) => (
                  <div
                    key={i}
                    title={`Pista #${i + 1}`}
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${
                      i < currentStageIndex
                        ? 'bg-emerald-600 text-white'
                        : i === currentStageIndex
                        ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 shadow-md animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* The Active Progressive Clue Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
              isFinalStage 
                ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/30' 
                : 'bg-slate-950 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
            }`}>
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isFinalStage ? 'text-red-400' : 'text-cyan-400'
                  }`}>
                    {effectiveClue.source || 'Inteligência da Central'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-0.5 flex items-center gap-2">
                    <Search className={`w-4 h-4 ${isFinalStage ? 'text-red-400' : 'text-cyan-400'}`} />
                    <span>{effectiveClue.title}</span>
                  </h4>
                </div>

                {voiceSynthEnabled && (
                  <button
                    onClick={() => handleSpeak(effectiveClue.text)}
                    title="Ouvir leitura da pista"
                    className="p-2 text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* The Clue Text Box */}
              <div className="p-4 bg-slate-900/90 border-l-4 border-cyan-400 rounded-r-xl text-slate-100 text-sm leading-relaxed font-sans font-medium">
                "{effectiveClue.text}"
              </div>

              {/* Tactical Guideline Box */}
              <div className="flex items-start gap-2.5 p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
                <KeyRound className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-cyan-300 block mb-0.5">Missão do Agente:</strong>
                  {isFinalStage ? (
                    <span>
                      Você alcançou a etapa final! Reúna as pistas coletadas sobre o suspeito e acione o <strong>Protocolo de Captura</strong> antes dos 20 minutos.
                    </span>
                  ) : (
                    <span>
                      Analise as referências geográficas, culturais, moedas ou monumentos da pista acima, localize o próximo destino no <strong>Mapa Tático</strong> ou no <strong>Painel de Voo</strong> e viaje para lá!
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Future Clues Preview Lock */}
            {!isFinalStage && (
              <div className="p-3 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span>Pista #{currentStageIndex + 2} bloqueada</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Libera após viajar e chegar ao próximo destino
                </span>
              </div>
            )}

          </div>
        )}

        {/* 2. HISTORY OF PREVIOUS CLUES */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2">
              Pistas coletadas em destinos anteriores da investigação:
            </div>

            {historyClues.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Nenhum destino anterior. Você está na Pista Inicial (Ponto de Partida).
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyClues.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Pista #{item.stageNumber} — Descoberta em {item.cityName}
                      </span>
                      {voiceSynthEnabled && (
                        <button
                          onClick={() => handleSpeak(item.clue.text)}
                          className="text-slate-400 hover:text-cyan-300 p-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      "{item.clue.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. CONFISCATED DOCUMENT TAB */}
        {activeTab === 'document' && document && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">
                  Documentação Apreendida no Local
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-0.5">
                  {document.title}
                </h4>
              </div>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-bold rounded">
                CONFIDENCIAL
              </span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
              {document.content}
            </div>

            {document.details && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(document.details).map(([k, v]) => (
                  <div key={k} className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{k}</span>
                    <span className="text-slate-200 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              <span>Emissor: {document.issuer}</span>
              <span>Data: {document.date}</span>
            </div>
          </div>
        )}

        {/* 4. CIPHER CRACKER TAB */}
        {activeTab === 'cipher' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>Decodificador de Mensagens Interceptadas</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-cyan-900/50 rounded-xl text-xs space-y-2">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Mensagem Cifrada:</div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-cyan-300 font-bold tracking-widest text-center text-sm">
                {cipherDecrypted 
                  ? 'ROTA FINAL CONFIRMADA: O SUSPEITO OPERA COM CHAVE DE SEGURANÇA MESTRE.' 
                  : 'URWD ILQDO FRQILUPDGD: R VXUSHGWR RSHUD FRP FKDYH GH VHJXUDQFD PHVWUH.'}
              </div>
            </div>

            <form onSubmit={handleVerifyCipher} className="space-y-3">
              <label className="block text-xs text-slate-300">
                Insira a chave de transposição ou código de quebra da Agência (Cifra ROT-3):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  placeholder="Ex: CHAVE-X ou 3"
                  className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Decifrar
                </button>
              </div>
            </form>

            {cipherDecrypted && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cifra quebrada com sucesso! Informação anexada ao Dossiê tático.</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
