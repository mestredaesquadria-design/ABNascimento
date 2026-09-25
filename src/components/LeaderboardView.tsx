import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game.ts';
import { Trophy, Globe, Filter, Search, Award, Flame } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentAgentCodename: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  currentAgentCodename,
}) => {
  const [filter, setFilter] = useState<'all' | 'country' | 'hard' | 'week'>('all');
  const [search, setSearch] = useState('');

  const currentAgent = entries.find(e => e.codename === currentAgentCodename);

  const filteredEntries = entries.filter(item => {
    if (search.trim()) {
      const match = item.agentName.toLowerCase().includes(search.toLowerCase()) ||
                    item.codename.toLowerCase().includes(search.toLowerCase()) ||
                    item.nationality.toLowerCase().includes(search.toLowerCase());
      if (!match) return false;
    }
    if (filter === 'country' && currentAgent) {
      return item.nationality === currentAgent.nationality;
    }
    if (filter === 'hard') {
      return item.hardCases >= 5;
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-cyan-900/40 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with Title and Filters */}
      <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base font-mono tracking-wider uppercase">
              Ranking Global dos Agentes
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Classificação internacional calculada por precisão, casos e complexidade
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setFilter('all');
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'all' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌎 Global
          </button>
          <button
            onClick={() => {
              setFilter('country');
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'country' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentAgent ? `${currentAgent.flag} Meu País` : 'País'}
          </button>
          <button
            onClick={() => {
              setFilter('hard');
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'hard' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Casos Difíceis
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por codinome, nome ou país..."
          className="w-full bg-transparent text-xs font-mono text-slate-200 outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase text-[10px]">
              <th className="py-3 px-4 w-16 text-center">Posição</th>
              <th className="py-3 px-4">Agente</th>
              <th className="py-3 px-4">País</th>
              <th className="py-3 px-4 text-center">Casos Resolvidos</th>
              <th className="py-3 px-4 text-center">Tempo Médio</th>
              <th className="py-3 px-4 text-center">Difíceis</th>
              <th className="py-3 px-4 text-right">Pontuação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEntries.map((item, idx) => {
              const isCurrent = item.codename === currentAgentCodename;
              return (
                <tr
                  key={item.codename}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-cyan-950/40 text-cyan-200 font-semibold hover:bg-cyan-950/60'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    {idx === 0 ? (
                      <span className="text-amber-400 font-bold text-sm">🥇 1</span>
                    ) : idx === 1 ? (
                      <span className="text-slate-300 font-bold text-sm">🥈 2</span>
                    ) : idx === 2 ? (
                      <span className="text-amber-600 font-bold text-sm">🥉 3</span>
                    ) : (
                      <span className="text-slate-500 font-mono">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{item.codename}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 uppercase">
                          Você
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{item.agentName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mr-1.5">{item.flag}</span>
                    <span className="text-slate-400">{item.nationality}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">
                    {item.casesSolved}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">
                    {item.avgTime}
                  </td>
                  <td className="py-3 px-4 text-center text-amber-400">
                    {item.hardCases}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-cyan-400">
                    {item.score.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
