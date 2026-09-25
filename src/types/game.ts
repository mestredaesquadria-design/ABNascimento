export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type AgentRank = 
  | 'Recruta'
  | 'Agente Júnior'
  | 'Investigador'
  | 'Agente Especial'
  | 'Agente Sênior'
  | 'Agente Elite'
  | 'Mestre Investigador';

export interface AgentProfile {
  id: string;
  name: string;
  codename: string;
  nationality: string;
  flag: string;
  avatarUrl?: string;
  emoji: string;
  rank: AgentRank;
  experience: number;
  casesSolved: number;
  casesArchived: number;
  totalTravelMinutes: number;
  totalInvestigationMinutes: number;
  bestTimeMinutes: number;
  currentLevel: number;
  worldRank: number;
  consecutiveWins: number;
  accuracyRate: number;
  unlockedStages: number;
}

export interface Clue {
  id: string;
  type: 'witness' | 'document' | 'surveillance' | 'forensic' | 'wiretap';
  title: string;
  text: string;
  source: string;
  hintToNextCity: boolean;
  discoveredAt?: string;
}

export interface Witness {
  name: string;
  role: string;
  statement: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  evidenceReaction: string;
}

export interface CaseDocument {
  type: 'passport' | 'boarding_pass' | 'encrypted_memo' | 'bank_receipt' | 'police_report' | 'wiretap_log';
  title: string;
  content: string;
  issuer: string;
  date: string;
  serialNumber?: string;
  details?: Record<string, string>;
}

export interface Destination {
  order: number;
  city: string;
  country: string;
  flag: string;
  airportCode: string;
  lat: number;
  lng: number;
  description: string;
  travelTimeMinutes: number;
  witness: Witness;
  clues: Clue[];
  document?: CaseDocument;
}

export interface Suspect {
  name: string;
  codename: string;
  age: number;
  profession: string;
  appearance: string;
  motive: string;
  avatarType: string;
  photoUrl?: string;
}

export interface Crime {
  title: string;
  category: string;
  description: string;
  stolenItemOrSecret: string;
  estimatedValue?: string;
}

export interface CaseData {
  id: string;
  operationName: string;
  briefing: string;
  difficulty: DifficultyLevel;
  stageNumber: number;
  suspect: Suspect;
  crime: Crime;
  keyEvidence: {
    title: string;
    description: string;
    type: string;
  };
  destinations: Destination[];
  status?: 'active' | 'solved' | 'archived';
  startedAt?: string;
  completedAt?: string;
  totalScore?: number;
  failureReason?: string;
}

export interface MissionState {
  currentCityIndex: number;
  visitedCityIndices: number[];
  discoveredClueIds: string[];
  travelTimeMinutes: number;
  investigationTimeMinutes: number;
  capturePhaseActive: boolean;
  captureTimeRemainingSeconds: number; // 20:00 (1200 seconds)
  interrogatedWitnesses: string[];
  inspectedDocuments: string[];
  hintsUsed: number;
  wrongTravelAttempts: number;
  correctAnswersCount: number;
  interrogationLog: Array<{ sender: string; role?: string; text: string; time: string }>;
}

export interface MissionResult {
  caseId: string;
  operationName: string;
  agentCodename: string;
  success: boolean;
  solvedAt: string;
  totalMinutes: number;
  travelMinutes: number;
  investigationMinutes: number;
  accuracy: number;
  cluesUsedCount: number;
  totalCluesCount: number;
  destinationsVisited: string[];
  difficulty: DifficultyLevel;
  score: number;
  experienceEarned: number;
  promotedToRank?: AgentRank;
  failureReason?: string;
}

export interface GameSettings {
  soundMusic: boolean;
  soundSfx: boolean;
  voiceSynth: boolean;
  highContrast: boolean;
  largeFont: boolean;
  fontSizeLevel?: 'normal' | 'large' | 'huge';
  reduceMotion: boolean;
  language: string;
}

export interface LeaderboardEntry {
  rank: number;
  agentName: string;
  codename: string;
  nationality: string;
  flag: string;
  casesSolved: number;
  avgTime: string;
  score: number;
  hardCases: number;
  badge: string;
}
