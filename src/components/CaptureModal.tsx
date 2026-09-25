import React, { useState, useEffect, useMemo } from 'react';
import { CaseData, Destination, Suspect } from '../types/game.ts';
import { SUSPECTS_TEMPLATES, WORLD_CITIES } from '../services/proceduralGenerator.ts';
import { AlertTriangle, ShieldCheck, Target, Check, Timer, Lock, Skull, UserCheck, MapPin, FileText } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface CaptureModalProps {
  caseData: CaseData;
  timeRemainingSeconds: number;
  onConfirmCapture: (suspect: Suspect, destinationCity: string, evidenceTitle: string) => void;
  onClose: () => void;
  onTimeExpired: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  caseData,
  timeRemainingSeconds,
  onConfirmCapture,
  onClose,
  onTimeExpired,
}) => {
  const [selectedSuspectName, setSelectedSuspectName] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedEvidence, setSelectedEvidence] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Sound alert on open
  useEffect(() => {
    audioEngine.playAlertSiren();
  }, []);

  // Stable suspects candidates pool: the real suspect + others as suspects from the agency pool
  // Wrapped in useMemo with deterministic sort so it NEVER shuffles or jumps on timer tick!
  const suspectCandidates = useMemo(() => {
    const list = [
      caseData.suspect,
      ...SUSPECTS_TEMPLATES.filter(s => s.name !== caseData.suspect.name).slice(0, 3),
    ];
    // Deterministic sort by name ensures absolute stability
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [caseData.id, caseData.suspect.name]);

  // Stable destinations: the 6 destinations of the case
  const possibleCities = useMemo(() => {
    return caseData.destinations.map(d => d.city);
  }, [caseData.id, caseData.destinations]);

  // Stable evidences: the keyEvidence plus alternative items
  const possibleEvidences = useMemo(() => {
    return [
      caseData.keyEvidence.title,
      `Passaporte falso com carimbo biométrico violado em ${caseData.destinations[0]?.city || 'trânsito'}`,
      `Cópia física do arquivo confidencial sem autorização da Agência`,
      `Registro de chamada anônima gravada em linha pública`,
    ];
  }, [caseData.id, caseData.keyEvidence.title]);

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspectName || !selectedCity || !selectedEvidence) {
      setValidationError('Selecione todos os 3 campos obrigatórios abaixo para validar o mandado.');
      audioEngine.playWrong();
      return;
    }

    const suspectObj = suspectCandidates.find(s => s.name === selectedSuspectName) || caseData.suspect;
    onConfirmCapture(suspectObj, selectedCity, selectedEvidence);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-red-600/70 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Red Alert Header */}
        <div className="px-6 py-4 bg-red-950/80 border-b border-red-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse shrink-0" />
            <div>
              <h3 className="font-bold text-red-200 text-base sm:text-lg font-mono tracking-wider uppercase">
                🚨 Protocolo de Autorização de Captura
              </h3>
              <p className="text-xs text-red-300/80 font-mono">
                Mandado Internacional de Prisão — Caso {caseData.id}
              </p>
            </div>
          </div>

          {/* Capture Countdown Timer */}
          <div className="flex items-center gap-2 bg-red-900/90 border border-red-500 px-3 py-1.5 rounded-lg text-white font-mono font-bold text-base shadow-lg shrink-0">
            <Timer className="w-5 h-5 text-red-300" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>
        </div>

        <form onSubmit={handleExecuteOrder} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          <div className="bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
            <span className="text-red-400 font-bold block mb-1">COMUNICADO DA SEDE CENTRAL:</span>
            Para autorizar a operação tática de cerco internacional, confirme a identidade do suspeito, a cidade onde ele está encurralado e a evidência material que fundamenta a prisão.
          </div>

          {validationError && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-xs sm:text-sm font-mono text-red-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Question 1: Suspect */}
          <div>
            <label className="block text-xs sm:text-sm font-mono text-slate-200 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-red-400" />
              <span>1. Quem é o suspeito responsável?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suspectCandidates.map((s) => {
                const isSelected = selectedSuspectName === s.name;
                return (
                  <button
                    type="button"
                    key={s.name}
                    onClick={() => {
                      setSelectedSuspectName(s.name);
                      setValidationError(null);
                      audioEngine.playClick();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all font-mono relative flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-950/70 text-red-100 ring-2 ring-red-500 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                        <span>{s.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black tracking-wider uppercase inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Selecionado
                          </span>
                        )}
                      </div>
                      <div className="text-cyan-400 text-xs mt-0.5">"{s.codename}"</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-1">{s.profession}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-red-400 bg-red-600 text-white' : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Destination City */}
          <div>
            <label className="block text-xs sm:text-sm font-mono text-slate-200 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>2. Qual é a localização / esconderijo final do suspeito?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {possibleCities.map((cityName) => {
                const isSelected = selectedCity === cityName;
                const cityInfo = WORLD_CITIES.find(c => c.city === cityName);
                return (
                  <button
                    type="button"
                    key={cityName}
                    onClick={() => {
                      setSelectedCity(cityName);
                      setValidationError(null);
                      audioEngine.playClick();
                    }}
                    className={`p-3 rounded-xl border text-center transition-all font-mono relative cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-950/70 text-red-100 ring-2 ring-red-500 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{cityInfo?.flag || '📍'}</span>
                    <span className="font-bold text-xs sm:text-sm block truncate">{cityName}</span>
                    {isSelected && (
                      <span className="text-[10px] text-red-300 font-bold block mt-1 uppercase">
                        ✓ Selecionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Key Evidence */}
          <div>
            <label className="block text-xs sm:text-sm font-mono text-slate-200 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-red-400" />
              <span>3. Qual evidência comprova o crime e fundamenta a prisão?</span>
            </label>
            <div className="space-y-2">
              {possibleEvidences.map((ev) => {
                const isSelected = selectedEvidence === ev;
                return (
                  <button
                    type="button"
                    key={ev}
                    onClick={() => {
                      setSelectedEvidence(ev);
                      setValidationError(null);
                      audioEngine.playClick();
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all font-mono text-xs sm:text-sm relative flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-950/70 text-red-100 ring-2 ring-red-500 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <span className="flex-1 pr-3">{ev}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-red-400 bg-red-600 text-white' : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo da Validação */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-400 uppercase font-bold tracking-wider mb-1.5">Resumo da Acusação:</div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Suspeito:</span>
              <strong className={selectedSuspectName ? 'text-red-400' : 'text-slate-500'}>
                {selectedSuspectName || 'Pendente'}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Localização:</span>
              <strong className={selectedCity ? 'text-cyan-400' : 'text-slate-500'}>
                {selectedCity || 'Pendente'}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Evidência:</span>
              <strong className={selectedEvidence ? 'text-amber-400 truncate max-w-[240px]' : 'text-slate-500'}>
                {selectedEvidence || 'Pendente'}
              </strong>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              Voltar à Investigação
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-950 font-mono cursor-pointer"
            >
              <Target className="w-4 h-4" />
              Executar Mandado de Prisão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
