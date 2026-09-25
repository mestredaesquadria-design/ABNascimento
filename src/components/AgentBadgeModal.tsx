import React, { useState } from 'react';
import { AgentProfile } from '../types/game.ts';
import { Shield, Award, User, Globe, Camera, Check, Sparkles, X } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface AgentBadgeModalProps {
  profile: AgentProfile;
  onSave: (updatedProfile: AgentProfile) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

const NATIONALITIES = [
  { country: 'Brasil', flag: '🇧🇷', lang: 'Português (BR)' },
  { country: 'Portugal', flag: '🇵🇹', lang: 'Português (PT)' },
  { country: 'Estados Unidos', flag: '🇺🇸', lang: 'English' },
  { country: 'França', flag: '🇫🇷', lang: 'Français' },
  { country: 'Itália', flag: '🇮🇹', lang: 'Italiano' },
  { country: 'Espanha', flag: '🇪🇸', lang: 'Español' },
  { country: 'Alemanha', flag: '🇩🇪', lang: 'Deutsch' },
  { country: 'Japão', flag: '🇯🇵', lang: '日本語' },
  { country: 'Reino Unido', flag: '🇬🇧', lang: 'English (UK)' },
  { country: 'Argentina', flag: '🇦🇷', lang: 'Español' },
];

const PRESET_EMOJIS = ['🕵️', '🕶️', '🦅', '🐺', '⚡', '🎯', '🦉', '♟️', '🦁', '🛡️'];

export const AgentBadgeModal: React.FC<AgentBadgeModalProps> = ({
  profile,
  onSave,
  onClose,
  isInitialSetup = false,
}) => {
  const [name, setName] = useState(profile.name || 'André');
  const [codename, setCodename] = useState(profile.codename || 'Agente X');
  const [nationality, setNationality] = useState(profile.nationality || 'Brasil');
  const [selectedEmoji, setSelectedEmoji] = useState(profile.emoji || '🕵️');
  const [photoUrl, setPhotoUrl] = useState(profile.avatarUrl || '');

  const selectedCountryObj = NATIONALITIES.find(n => n.country === nationality) || NATIONALITIES[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        audioEngine.playClick();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSuccess();

    // Auto-generate avatar color/seed if no photo
    const updated: AgentProfile = {
      ...profile,
      name: name.trim() || 'Agente',
      codename: codename.trim() || 'Agente X',
      nationality: selectedCountryObj.country,
      flag: selectedCountryObj.flag,
      emoji: selectedEmoji,
      avatarUrl: photoUrl || undefined,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wider uppercase font-mono">
                {isInitialSetup ? 'Cadastro de Credencial da Agência' : 'Dossiê do Agente'}
              </h3>
              <p className="text-xs text-slate-400">
                Divisão de Operações Confidenciais Globais
              </p>
            </div>
          </div>
          {!isInitialSetup && onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Credential ID Card Visual */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-center relative overflow-hidden shadow-inner">
              <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-500/70 uppercase">
                ID: {profile.id.slice(0, 8)}
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                <Award className="w-3 h-3" />
                <span>{profile.rank.toUpperCase()}</span>
              </div>

              {/* Avatar / Photo Container */}
              <div className="relative mt-5 mb-3">
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-slate-900 flex items-center justify-center shadow-lg">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Foto do Agente" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-slate-800 to-slate-950">
                      <span className="text-4xl">{selectedEmoji}</span>
                      <span className="text-[10px] font-mono text-cyan-400 mt-1">{selectedCountryObj.flag}</span>
                    </div>
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-full cursor-pointer shadow-md transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="font-bold text-slate-100 text-base">{codename || 'Codinome'}</div>
              <div className="text-xs text-slate-400 mb-3">{name || 'Nome Real'} · {selectedCountryObj.country} {selectedCountryObj.flag}</div>

              {/* Badge Stats Mini Grid */}
              <div className="w-full grid grid-cols-2 gap-1.5 text-left font-mono text-[10px] border-t border-slate-800/80 pt-3">
                <div className="bg-slate-900/70 p-1.5 rounded">
                  <span className="text-slate-500 block">Casos Resolvidos:</span>
                  <span className="text-emerald-400 font-bold">{profile.casesSolved}</span>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded">
                  <span className="text-slate-500 block">Experiência:</span>
                  <span className="text-cyan-400 font-bold">{profile.experience} XP</span>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded">
                  <span className="text-slate-500 block">Melhor Tempo:</span>
                  <span className="text-amber-400 font-bold">{profile.bestTimeMinutes > 0 ? `${profile.bestTimeMinutes} min` : '--:--'}</span>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded">
                  <span className="text-slate-500 block">Ranking Mundial:</span>
                  <span className="text-purple-400 font-bold">#{profile.worldRank}</span>
                </div>
              </div>
            </div>

            {/* Right: Form Fields */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Nome do Agente
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Apelido / Codinome
                </label>
                <input
                  type="text"
                  required
                  value={codename}
                  onChange={(e) => setCodename(e.target.value)}
                  placeholder="Ex: Águia, Fantasma, Sombra"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Nacionalidade
                </label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors font-mono"
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n.country} value={n.country}>
                      {n.flag} {n.country} ({n.lang})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  A IA adaptará comunicações e relatórios ao contexto da sua nacionalidade.
                </p>
              </div>

              {/* Emoji Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Avatar / Emblema do Agente
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setPhotoUrl('');
                        audioEngine.playClick();
                      }}
                      className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg border transition-all ${
                        selectedEmoji === emoji && !photoUrl
                          ? 'border-cyan-400 bg-cyan-950/60 scale-105 shadow-cyan-900/50 shadow'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {!isInitialSetup && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-900/30 font-mono"
            >
              <Check className="w-4 h-4" />
              {isInitialSetup ? 'Ativar Credencial e Iniciar' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
