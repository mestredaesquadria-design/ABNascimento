import { AgentProfile, AgentRank, CaseData, GameSettings, LeaderboardEntry, MissionResult, MissionState } from '../types/game.ts';

const STORAGE_KEYS = {
  PROFILE: 'agente_x_profile_v1',
  ACTIVE_CASE: 'agente_x_active_case_v1',
  ACTIVE_MISSION: 'agente_x_active_mission_v1',
  SOLVED_CASES: 'agente_x_solved_cases_v1',
  ARCHIVED_CASES: 'agente_x_archived_cases_v1',
  SETTINGS: 'agente_x_settings_v1',
  LEADERBOARD: 'agente_x_leaderboard_v1',
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundMusic: true,
  soundSfx: true,
  voiceSynth: true,
  highContrast: false,
  largeFont: true,
  fontSizeLevel: 'large',
  reduceMotion: false,
  language: 'pt-BR',
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, agentName: 'André', codename: 'Águia Real', nationality: 'Brasil', flag: '🇧🇷', casesSolved: 28, avgTime: '18:42', score: 98450, hardCases: 12, badge: '⭐ ELITE' },
  { rank: 2, agentName: 'Sarah Jenkins', codename: 'Shadow', nationality: 'Estados Unidos', flag: '🇺🇸', casesSolved: 26, avgTime: '21:10', score: 89200, hardCases: 10, badge: '🏅 SÊNIOR' },
  { rank: 3, agentName: 'Jean-Luc Moreau', codename: 'Raven', nationality: 'França', flag: '🇫🇷', casesSolved: 25, avgTime: '22:30', score: 86400, hardCases: 9, badge: '🏅 SÊNIOR' },
  { rank: 4, agentName: 'Hana Tanaka', codename: 'Cipher-9', nationality: 'Japão', flag: '🇯🇵', casesSolved: 22, avgTime: '19:55', score: 79800, hardCases: 8, badge: '🎖️ ESPECIAL' },
  { rank: 5, agentName: 'Klaus Richter', codename: 'Valkyrie', nationality: 'Alemanha', flag: '🇩🇪', casesSolved: 19, avgTime: '23:40', score: 68300, hardCases: 6, badge: '🎖️ ESPECIAL' },
  { rank: 6, agentName: 'Matteo Bellini', codename: 'Falco', nationality: 'Itália', flag: '🇮🇹', casesSolved: 15, avgTime: '24:12', score: 54100, hardCases: 4, badge: '🔎 INVESTIGADOR' },
  { rank: 7, agentName: 'Beatriz Costa', codename: 'Lince', nationality: 'Portugal', flag: '🇵🇹', casesSolved: 12, avgTime: '25:30', score: 43200, hardCases: 3, badge: '🔎 INVESTIGADOR' },
  { rank: 8, agentName: 'Liam O’Connor', codename: 'Ghost', nationality: 'Reino Unido', flag: '🇬🇧', casesSolved: 9, avgTime: '26:40', score: 32500, hardCases: 2, badge: '🕵️ JÚNIOR' },
];

export function getRankFromStats(solved: number, hardSolved: number, accuracy: number): AgentRank {
  if (solved >= 30 && hardSolved >= 8 && accuracy >= 80) return 'Mestre Investigador';
  if (solved >= 22 && hardSolved >= 5) return 'Agente Elite';
  if (solved >= 15 && hardSolved >= 3) return 'Agente Sênior';
  if (solved >= 10) return 'Agente Especial';
  if (solved >= 5) return 'Investigador';
  if (solved >= 2) return 'Agente Júnior';
  return 'Recruta';
}

export const StorageService = {
  getProfile(): AgentProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveProfile(profile: AgentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {}
  },

  getActiveCase(): CaseData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_CASE);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.destinations) && parsed.destinations.length >= 3 && parsed.destinations[0]?.city) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  saveActiveCase(caseData: CaseData | null): void {
    try {
      if (!caseData) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CASE);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CASE, JSON.stringify(caseData));
      }
    } catch (e) {}
  },

  getActiveMission(): MissionState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_MISSION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed.currentCityIndex === 'number' && Array.isArray(parsed.visitedCityIndices)) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  saveActiveMission(mission: MissionState | null): void {
    try {
      if (!mission) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_MISSION);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_MISSION, JSON.stringify(mission));
      }
    } catch (e) {}
  },

  getSolvedCases(): MissionResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLVED_CASES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addSolvedCase(result: MissionResult): void {
    try {
      const list = this.getSolvedCases();
      list.unshift(result);
      localStorage.setItem(STORAGE_KEYS.SOLVED_CASES, JSON.stringify(list));
    } catch (e) {}
  },

  getArchivedCases(): MissionResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARCHIVED_CASES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addArchivedCase(result: MissionResult): void {
    try {
      const list = this.getArchivedCases();
      list.unshift(result);
      localStorage.setItem(STORAGE_KEYS.ARCHIVED_CASES, JSON.stringify(list));
    } catch (e) {}
  },

  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        largeFont: parsed.largeFont !== undefined ? parsed.largeFont : true,
        fontSizeLevel: parsed.fontSizeLevel || (parsed.largeFont ? 'large' : 'large'),
      };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : INITIAL_LEADERBOARD;
    } catch (e) {
      return INITIAL_LEADERBOARD;
    }
  },

  updateLeaderboardWithAgent(profile: AgentProfile): LeaderboardEntry[] {
    const list = this.getLeaderboard();
    const existingIndex = list.findIndex(e => e.codename === profile.codename);
    const hardCount = this.getSolvedCases().filter(c => c.difficulty === 'hard').length;
    const avgTimeStr = profile.casesSolved > 0 
      ? `${Math.floor((profile.totalTravelMinutes + profile.totalInvestigationMinutes) / profile.casesSolved)}:00`
      : '00:00';

    const entry: LeaderboardEntry = {
      rank: 1,
      agentName: profile.name,
      codename: profile.codename,
      nationality: profile.nationality,
      flag: profile.flag,
      casesSolved: profile.casesSolved,
      avgTime: avgTimeStr,
      score: profile.experience,
      hardCases: hardCount,
      badge: profile.rank.toUpperCase(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = entry;
    } else {
      list.push(entry);
    }

    // Sort by score desc, then cases desc
    list.sort((a, b) => b.score - a.score || b.casesSolved - a.casesSolved);
    list.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    } catch (e) {}
    return list;
  },

  resetAll(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
