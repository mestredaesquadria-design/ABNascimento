import React, { useState, useEffect, useRef } from 'react';
import { 
  AgentProfile, 
  CaseData, 
  DifficultyLevel, 
  GameSettings, 
  MissionResult, 
  MissionState, 
  Suspect,
  Destination
} from './types/game.ts';
import { 
  StorageService, 
  DEFAULT_SETTINGS, 
  getRankFromStats 
} from './services/storageService.ts';
import { 
  WORLD_CITIES, 
  calculateFlightDurationMinutes, 
  formatMissionTime 
} from './services/proceduralGenerator.ts';
import { ApiClient } from './services/apiClient.ts';
import { audioEngine } from './services/audioService.ts';

// Components
import { TitleScreen } from './components/TitleScreen.tsx';
import { HeadquartersView } from './components/HeadquartersView.tsx';
import { WorldMap } from './components/WorldMap.tsx';
import { EvidenceDossier } from './components/EvidenceDossier.tsx';
import { WitnessRoom } from './components/WitnessRoom.tsx';
import { MestreAiPanel } from './components/MestreAiPanel.tsx';
import { CaptureModal } from './components/CaptureModal.tsx';
import { MissionResultView } from './components/MissionResultView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { ArchivedCasesView } from './components/ArchivedCasesView.tsx';
import { AgentBadgeModal } from './components/AgentBadgeModal.tsx';
import { NewOperationModal } from './components/NewOperationModal.tsx';
import { MultiplayerModal } from './components/MultiplayerModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { GameManualModal } from './components/GameManualModal.tsx';

// Icons
import { 
  Shield, 
  Globe, 
  Search, 
  Trophy, 
  BookOpen, 
  Settings, 
  Plane, 
  AlertTriangle, 
  Timer, 
  Target, 
  Radio, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Home
} from 'lucide-react';

export default function App() {
  // Navigation state & history stack
  type ViewType = 'TITLE' | 'HQ' | 'INVESTIGATION' | 'MAP' | 'RESULT' | 'RANKING' | 'ARCHIVES';
  const [activeView, setActiveView] = useState<ViewType>('TITLE');
  const [viewHistory, setViewHistory] = useState<ViewType[]>([]);

  const navigateTo = (view: ViewType) => {
    if (view === activeView) return;
    audioEngine.playClick();
    setViewHistory(prev => [...prev, activeView]);
    setActiveView(view);
  };

  const navigateBack = () => {
    audioEngine.playClick();
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(history => history.slice(0, -1));
      setActiveView(prev);
    } else {
      setActiveView(activeView === 'TITLE' ? 'HQ' : 'TITLE');
    }
  };

  const navigateHome = () => {
    audioEngine.playClick();
    if (activeView !== 'TITLE') {
      setViewHistory(prev => [...prev, activeView]);
      setActiveView('TITLE');
    }
  };

  // Core Data States
  const [profile, setProfile] = useState<AgentProfile>(() => {
    return StorageService.getProfile() || {
      id: `AX-${Math.floor(100000 + Math.random() * 900000)}`,
      name: 'André',
      codename: 'Agente X',
      nationality: 'Brasil',
      flag: '🇧🇷',
      emoji: '🕵️',
      rank: 'Recruta',
      experience: 1200,
      casesSolved: 0,
      casesArchived: 0,
      totalTravelMinutes: 0,
      totalInvestigationMinutes: 0,
      bestTimeMinutes: 0,
      currentLevel: 1,
      worldRank: 42,
      consecutiveWins: 0,
      accuracyRate: 100,
      unlockedStages: 1,
    };
  });

  const [activeCase, setActiveCase] = useState<CaseData | null>(() => StorageService.getActiveCase());
  const [missionState, setMissionState] = useState<MissionState>(() => {
    return StorageService.getActiveMission() || {
      currentCityIndex: 0,
      visitedCityIndices: [0],
      discoveredClueIds: [],
      travelTimeMinutes: 0,
      investigationTimeMinutes: 0,
      capturePhaseActive: false,
      captureTimeRemainingSeconds: 1200, // 20:00
      interrogatedWitnesses: [],
      inspectedDocuments: [],
      hintsUsed: 0,
      wrongTravelAttempts: 0,
      correctAnswersCount: 0,
      interrogationLog: [],
    };
  });

  const [solvedCases, setSolvedCases] = useState<MissionResult[]>(() => StorageService.getSolvedCases());
  const [archivedCases, setArchivedCases] = useState<MissionResult[]>(() => StorageService.getArchivedCases());
  const [settings, setSettings] = useState<GameSettings>(() => StorageService.getSettings());
  const [latestResult, setLatestResult] = useState<MissionResult | null>(null);

  // Modals
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [isInitialProfileSetup, setIsInitialProfileSetup] = useState(false);
  const [newOpModalOpen, setNewOpModalOpen] = useState(false);
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [multiplayerModalOpen, setMultiplayerModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [tacticalAlert, setTacticalAlert] = useState<{ title: string; message: string; type?: 'warning' | 'error' | 'info' } | null>(null);

  // Flight animation state
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelCityName, setTravelCityName] = useState<string | null>(null);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);

  // Investigation sub-tab
  const [investigationTab, setInvestigationTab] = useState<'clues' | 'witness' | 'mestre'>('clues');

  // Apply settings to Audio Engine
  useEffect(() => {
    audioEngine.setSettings(settings.soundMusic, settings.soundSfx, settings.voiceSynth);
  }, [settings]);

  // Apply font scaling to document root element
  useEffect(() => {
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-huge');
    if (settings.fontSizeLevel === 'huge') {
      document.documentElement.classList.add('font-scale-huge');
    } else if (settings.fontSizeLevel === 'normal' && !settings.largeFont) {
      document.documentElement.classList.add('font-scale-normal');
    } else {
      document.documentElement.classList.add('font-scale-large');
    }
  }, [settings.fontSizeLevel, settings.largeFont]);

  // Audio atmosphere router
  useEffect(() => {
    if (activeView === 'TITLE' || activeView === 'HQ') {
      audioEngine.playAtmosphere('suspense');
    } else if (activeView === 'INVESTIGATION' || activeView === 'MAP') {
      if (missionState.capturePhaseActive) {
        audioEngine.playAtmosphere('pursuit');
      } else {
        audioEngine.playAtmosphere('suspense');
      }
    }
  }, [activeView, missionState.capturePhaseActive]);

  // Auto-save
  useEffect(() => {
    StorageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    StorageService.saveActiveCase(activeCase);
  }, [activeCase]);

  useEffect(() => {
    StorageService.saveActiveMission(missionState);
  }, [missionState]);

  // Countdown timer for 20:00 capture limit (Rule 9)
  useEffect(() => {
    let timer: any = null;
    if (activeCase && missionState.capturePhaseActive && missionState.captureTimeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setMissionState(prev => {
          if (prev.captureTimeRemainingSeconds <= 1) {
            clearInterval(timer);
            handleCaptureTimeExpired();
            return { ...prev, captureTimeRemainingSeconds: 0 };
          }
          return { ...prev, captureTimeRemainingSeconds: prev.captureTimeRemainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCase, missionState.capturePhaseActive, missionState.captureTimeRemainingSeconds]);

  // Handle Capture Time Expired (Rule 10)
  const handleCaptureTimeExpired = () => {
    if (!activeCase) return;
    audioEngine.playAlertSiren();
    setCaptureModalOpen(false);

    const totalMin = missionState.travelTimeMinutes + missionState.investigationTimeMinutes + 20;
    const finalDest = activeCase.destinations[activeCase.destinations.length - 1].city;

    const failedResult: MissionResult = {
      caseId: activeCase.id,
      operationName: activeCase.operationName,
      agentCodename: profile.codename,
      success: false,
      solvedAt: new Date().toISOString(),
      totalMinutes: totalMin,
      travelMinutes: missionState.travelTimeMinutes,
      investigationMinutes: missionState.investigationTimeMinutes + 20,
      accuracy: Math.max(30, Math.round((missionState.correctAnswersCount / Math.max(1, missionState.correctAnswersCount + missionState.wrongTravelAttempts + 1)) * 100)),
      cluesUsedCount: missionState.discoveredClueIds.length,
      totalCluesCount: activeCase.destinations.reduce((acc, d) => acc + d.clues.length, 0),
      destinationsVisited: missionState.visitedCityIndices.map(idx => activeCase.destinations[idx]?.city || 'Desconhecido'),
      difficulty: activeCase.difficulty,
      score: 1250, // Consolation score
      experienceEarned: 150,
      failureReason: `O tempo de perseguição de 20 minutos expirou. O suspeito conseguiu escapar da vigilância em ${finalDest}.`,
    };

    StorageService.addArchivedCase(failedResult);
    setArchivedCases(StorageService.getArchivedCases());

    // Update Profile
    const updatedProfile: AgentProfile = {
      ...profile,
      casesArchived: profile.casesArchived + 1,
      totalTravelMinutes: profile.totalTravelMinutes + failedResult.travelMinutes,
      totalInvestigationMinutes: profile.totalInvestigationMinutes + failedResult.investigationMinutes,
      experience: profile.experience + 150,
    };
    setProfile(updatedProfile);
    StorageService.updateLeaderboardWithAgent(updatedProfile);

    // Clear active case
    setActiveCase(null);
    StorageService.saveActiveCase(null);
    StorageService.saveActiveMission(null);

    setLatestResult(failedResult);
    setActiveView('RESULT');
  };

  // Launch New Operation (Rule 11)
  const handleStartOperation = async (difficulty: DifficultyLevel, stageNumber: number, isMasterMode: boolean) => {
    setIsGeneratingCase(true);
    audioEngine.playRadarPing();

    try {
      const { caseData } = await ApiClient.generateCase(
        difficulty,
        stageNumber,
        profile.nationality,
        profile.codename
      );

      const initialMission: MissionState = {
        currentCityIndex: 0,
        visitedCityIndices: [0],
        discoveredClueIds: caseData.destinations[0].clues.map(c => c.id),
        travelTimeMinutes: 0,
        investigationTimeMinutes: 15, // initial briefing & intake
        capturePhaseActive: false,
        captureTimeRemainingSeconds: 1200,
        interrogatedWitnesses: [],
        inspectedDocuments: [],
        hintsUsed: 0,
        wrongTravelAttempts: 0,
        correctAnswersCount: 1,
        interrogationLog: [],
      };

      setActiveCase(caseData);
      setMissionState(initialMission);
      StorageService.saveActiveCase(caseData);
      StorageService.saveActiveMission(initialMission);

      setNewOpModalOpen(false);
      setActiveView('INVESTIGATION');
      audioEngine.playSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  // Travel to City
  const handleTravelToCity = (targetCity: typeof WORLD_CITIES[0]) => {
    if (!activeCase || isTraveling) return;

    const currentDest = activeCase.destinations[missionState.currentCityIndex];
    if (targetCity.city === currentDest.city) return;

    const flightMins = calculateFlightDurationMinutes(
      currentDest.lat,
      currentDest.lng,
      targetCity.lat,
      targetCity.lng
    );

    setIsTraveling(true);
    setTravelCityName(targetCity.city);
    audioEngine.playFlightWhoosh();
    audioEngine.playAtmosphere('flight');

    setTimeout(() => {
      setIsTraveling(false);
      setTravelCityName(null);

      // Check if target is next case destination in sequence
      const nextDestIndex = missionState.currentCityIndex + 1;
      const expectedNextCity = activeCase.destinations[nextDestIndex]?.city;

      if (expectedNextCity && targetCity.city.toLowerCase() === expectedNextCity.toLowerCase()) {
        // Correct travel!
        audioEngine.playSuccess();
        const nextDestObj = activeCase.destinations[nextDestIndex];
        const newDiscoveredClues = Array.from(new Set([
          ...missionState.discoveredClueIds,
          ...nextDestObj.clues.map(c => c.id)
        ]));

        const isFinalDestination = nextDestIndex === activeCase.destinations.length - 1;

        setMissionState(prev => ({
          ...prev,
          currentCityIndex: nextDestIndex,
          visitedCityIndices: [...prev.visitedCityIndices, nextDestIndex],
          discoveredClueIds: newDiscoveredClues,
          travelTimeMinutes: prev.travelTimeMinutes + flightMins,
          investigationTimeMinutes: prev.investigationTimeMinutes + 20,
          correctAnswersCount: prev.correctAnswersCount + 1,
          capturePhaseActive: isFinalDestination ? true : prev.capturePhaseActive,
        }));

        if (isFinalDestination) {
          audioEngine.playAlertSiren();
          setCaptureModalOpen(true);
        } else {
          setActiveView('INVESTIGATION');
        }
      } else {
        // Wrong destination
        audioEngine.playWrong();
        setMissionState(prev => ({
          ...prev,
          travelTimeMinutes: prev.travelTimeMinutes + flightMins * 2, // penalty for round trip
          investigationTimeMinutes: prev.investigationTimeMinutes + 30,
          wrongTravelAttempts: prev.wrongTravelAttempts + 1,
        }));

        setTacticalAlert({
          title: 'ALERTA DA AGÊNCIA: ROTA INCORRETA',
          message: `Nenhum sinal do suspeito foi detectado em ${targetCity.city}. O agente retornou a ${currentDest.city}. Tempo de voo consumido na tentativa.`,
          type: 'warning',
        });
      }
    }, settings.reduceMotion ? 300 : 1200);
  };

  // Confirm Capture Protocol (Rule 18)
  const handleConfirmCapture = (suspect: Suspect, destinationCity: string, evidenceTitle: string) => {
    if (!activeCase) return;

    const correctSuspect = activeCase.suspect.name.toLowerCase() === suspect.name.toLowerCase();
    const finalDest = activeCase.destinations[activeCase.destinations.length - 1].city;
    const correctDestination = destinationCity.toLowerCase() === finalDest.toLowerCase();
    const correctEvidence = evidenceTitle.toLowerCase().includes(activeCase.keyEvidence.title.toLowerCase()) ||
                            evidenceTitle.toLowerCase().includes('passaporte') ||
                            evidenceTitle.toLowerCase().includes('registro');

    if (!correctSuspect || !correctDestination) {
      audioEngine.playWrong();
      setMissionState(prev => ({
        ...prev,
        investigationTimeMinutes: prev.investigationTimeMinutes + 45,
        captureTimeRemainingSeconds: Math.max(10, prev.captureTimeRemainingSeconds - 300), // loses 5 mins
      }));
      setTacticalAlert({
        title: 'MANDADO RECUSADO PELA CENTRAL',
        message: 'A Sede Central rejeitou a autorização de prisão! Os dados do suspeito ou o local de refúgio final não coincidem com as evidências coletadas.',
        type: 'error',
      });
      return;
    }

    // SUCCESSFUL CAPTURE!
    audioEngine.playSuccess();
    setCaptureModalOpen(false);

    const totalMinutes = missionState.travelTimeMinutes + missionState.investigationTimeMinutes;
    const diffMultiplier = activeCase.difficulty === 'easy' ? 1.0 : activeCase.difficulty === 'medium' ? 1.8 : 2.8;
    const timeBonus = Math.max(0, 5000 - totalMinutes * 25);
    const accuracy = Math.round((missionState.correctAnswersCount / Math.max(1, missionState.correctAnswersCount + missionState.wrongTravelAttempts)) * 100);
    const cluesUsedCount = missionState.discoveredClueIds.length;
    const totalClues = activeCase.destinations.reduce((acc, d) => acc + d.clues.length, 0);

    const baseScore = Math.round((4000 + timeBonus + accuracy * 30 + (totalClues - cluesUsedCount) * 100) * diffMultiplier);
    const xpEarned = Math.round(500 * diffMultiplier + accuracy * 2);

    const newSolvedCount = profile.casesSolved + 1;
    const newBestTime = profile.bestTimeMinutes === 0 
      ? totalMinutes 
      : Math.min(profile.bestTimeMinutes, totalMinutes);

    const newRank = getRankFromStats(
      newSolvedCount, 
      solvedCases.filter(c => c.difficulty === 'hard').length + (activeCase.difficulty === 'hard' ? 1 : 0),
      accuracy
    );

    const promoted = newRank !== profile.rank ? newRank : undefined;

    const resultObj: MissionResult = {
      caseId: activeCase.id,
      operationName: activeCase.operationName,
      agentCodename: profile.codename,
      success: true,
      solvedAt: new Date().toISOString(),
      totalMinutes,
      travelMinutes: missionState.travelTimeMinutes,
      investigationMinutes: missionState.investigationTimeMinutes,
      accuracy,
      cluesUsedCount,
      totalCluesCount: totalClues,
      destinationsVisited: missionState.visitedCityIndices.map(idx => activeCase.destinations[idx]?.city || 'Cidade'),
      difficulty: activeCase.difficulty,
      score: baseScore,
      experienceEarned: xpEarned,
      promotedToRank: promoted,
    };

    StorageService.addSolvedCase(resultObj);
    setSolvedCases(StorageService.getSolvedCases());

    const nextUnlockedStage = Math.max(profile.unlockedStages, activeCase.stageNumber + 1);

    const updatedProfile: AgentProfile = {
      ...profile,
      casesSolved: newSolvedCount,
      experience: profile.experience + xpEarned,
      bestTimeMinutes: newBestTime,
      totalTravelMinutes: profile.totalTravelMinutes + missionState.travelTimeMinutes,
      totalInvestigationMinutes: profile.totalInvestigationMinutes + missionState.investigationTimeMinutes,
      rank: newRank,
      unlockedStages: nextUnlockedStage,
    };

    setProfile(updatedProfile);
    StorageService.updateLeaderboardWithAgent(updatedProfile);

    // Clear active mission
    setActiveCase(null);
    StorageService.saveActiveCase(null);
    StorageService.saveActiveMission(null);

    setLatestResult(resultObj);
    setActiveView('RESULT');
  };

  const handleResetAllProgress = () => {
    StorageService.resetAll();
    window.location.reload();
  };

  const currentDestination: Destination | null = activeCase 
    ? activeCase.destinations[missionState.currentCityIndex] 
    : null;

  const nextDestination: Destination | null = activeCase && missionState.currentCityIndex < activeCase.destinations.length - 1
    ? activeCase.destinations[missionState.currentCityIndex + 1]
    : null;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${
      settings.highContrast ? 'contrast-125' : ''
    } ${settings.fontSizeLevel === 'huge' ? 'font-scale-huge text-xl' : (settings.fontSizeLevel === 'normal' && !settings.largeFont) ? 'font-scale-normal text-base' : 'font-scale-large text-lg'}`}>
      
      {/* Top Bar Contract: Zone 1 (Brand & Navigation) - Zone 2 (Nav Links) - Zone 3 (Primary Actions) */}
      <header className="h-16 px-3 sm:px-6 border-b border-cyan-900/40 bg-slate-950/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-40 shrink-0 gap-2">
        {/* Zone 1: Wordmark Logo + Back (Página Anterior) / Home (Página Inicial) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={navigateHome}
            className="cursor-pointer flex items-center gap-2 select-none"
            title="Página Inicial (Início)"
          >
            <Shield className="w-6 h-6 text-cyan-400 shrink-0" />
            <span className="text-base sm:text-lg font-black tracking-wider uppercase font-mono text-white hidden xs:inline">
              AGENTE <span className="text-cyan-400">X</span>
            </span>
          </div>

          {/* Botão Página Anterior / Voltar */}
          {activeView !== 'TITLE' && (
            <button
              onClick={navigateBack}
              title="Voltar à Página Anterior"
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/90 hover:border-cyan-500/60 rounded-lg text-slate-200 hover:text-cyan-300 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Voltar</span>
            </button>
          )}

          {/* Botão Página Inicial / Início */}
          <button
            onClick={navigateHome}
            title="Página Inicial (Tela de Abertura)"
            className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg font-mono text-xs font-bold transition-all shadow-sm cursor-pointer ${
              activeView === 'TITLE'
                ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-cyan-950/50'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-cyan-300'
            }`}
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Início</span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-mono font-medium text-slate-300">
          <button
            onClick={() => navigateTo('HQ')}
            className={`hover:text-cyan-300 transition-colors ${activeView === 'HQ' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : ''}`}
          >
            Central
          </button>
          {activeCase && (
            <button
              onClick={() => navigateTo('INVESTIGATION')}
              className={`hover:text-cyan-300 transition-colors flex items-center gap-1.5 ${
                activeView === 'INVESTIGATION' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : ''
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Investigação
            </button>
          )}
          <button
            onClick={() => navigateTo('MAP')}
            className={`hover:text-cyan-300 transition-colors flex items-center gap-1.5 ${
              activeView === 'MAP' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : ''
            }`}
          >
            <Globe className="w-4 h-4" />
            Mapa Tático
          </button>
          <button
            onClick={() => navigateTo('RANKING')}
            className={`hover:text-cyan-300 transition-colors ${activeView === 'RANKING' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : ''}`}
          >
            Ranking
          </button>
          <button
            onClick={() => navigateTo('ARCHIVES')}
            className={`hover:text-cyan-300 transition-colors ${activeView === 'ARCHIVES' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : ''}`}
          >
            Casos Arquivados
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              setManualModalOpen(true);
            }}
            className="hover:text-cyan-300 text-cyan-400 transition-colors flex items-center gap-1 font-bold"
          >
            <BookOpen className="w-4 h-4" />
            Manual
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + Quick Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Manual Button (mobile only) */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setManualModalOpen(true);
            }}
            title="Manual do Jogo"
            className="p-2 text-cyan-400 hover:text-cyan-200 bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-lg transition-colors md:hidden"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Quick Font Size Switcher Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              const nextLevel: 'normal' | 'large' | 'huge' = 
                (settings.fontSizeLevel === 'normal' && !settings.largeFont) ? 'large' :
                (settings.fontSizeLevel === 'huge') ? 'normal' : 'huge';
              const newSettings: GameSettings = {
                ...settings,
                fontSizeLevel: nextLevel,
                largeFont: nextLevel !== 'normal',
              };
              setSettings(newSettings);
              StorageService.saveSettings(newSettings);
            }}
            title="Aumentar Fonte (Clique para alternar entre Normal, Grande e Máxima)"
            className="flex items-center gap-1.5 py-1.5 px-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 rounded-lg text-cyan-300 font-mono text-xs font-bold transition-all shadow-sm"
          >
            <span className="text-sm font-black">A+</span>
            <span className="hidden sm:inline font-bold">
              {settings.fontSizeLevel === 'huge' ? 'Fonte: Máxima' : (settings.fontSizeLevel === 'normal' && !settings.largeFont) ? 'Fonte: Normal' : 'Fonte: Grande'}
            </span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setBadgeModalOpen(true);
            }}
            className="flex items-center gap-2 py-1.5 px-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-mono transition-colors"
          >
            <span className="text-lg">{profile.emoji}</span>
            <span className="font-bold text-slate-200 hidden sm:inline">{profile.codename}</span>
            <span className="text-xs text-amber-400 hidden sm:inline">({profile.rank})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setSettingsModalOpen(true);
            }}
            title="Configurações"
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main App Content Viewport with seamless natural scrolling */}
      <main className="flex-1 w-full p-4 sm:p-6 pb-16">
        {/* 1. TITLE VIEW */}
        {activeView === 'TITLE' && (
          <TitleScreen
            agentProfile={profile}
            hasActiveCase={Boolean(activeCase)}
            onStartNewGame={() => setNewOpModalOpen(true)}
            onResumeGame={() => navigateTo('INVESTIGATION')}
            onOpenProfile={() => setBadgeModalOpen(true)}
            onOpenRanking={() => navigateTo('RANKING')}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenMultiplayer={() => setMultiplayerModalOpen(true)}
            onOpenManual={() => setManualModalOpen(true)}
            reduceMotion={settings.reduceMotion}
          />
        )}

        {/* 2. HEADQUARTERS VIEW */}
        {activeView === 'HQ' && (
          <HeadquartersView
            profile={profile}
            activeCase={activeCase}
            onNewOperation={() => setNewOpModalOpen(true)}
            onResumeInvestigation={() => navigateTo('INVESTIGATION')}
            onOpenMap={() => navigateTo('MAP')}
            onOpenProfile={() => setBadgeModalOpen(true)}
            onOpenRanking={() => navigateTo('RANKING')}
            onOpenArchives={() => navigateTo('ARCHIVES')}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenMultiplayer={() => setMultiplayerModalOpen(true)}
            onOpenManual={() => setManualModalOpen(true)}
          />
        )}

        {/* 3. INVESTIGATION WORKSPACE */}
        {activeView === 'INVESTIGATION' && activeCase && currentDestination && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Tactical Investigation Top Ribbon */}
            <div className="bg-slate-900 border border-cyan-900/40 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={navigateBack}
                  className="px-2.5 py-1.5 text-slate-200 hover:text-cyan-300 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-all shadow-sm"
                  title="Página Anterior (Voltar)"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={navigateHome}
                  className="px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  title="Página Inicial (Início)"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Início</span>
                </button>
                <div className="ml-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{activeCase.operationName}</span>
                    <span className="text-slate-500">· ID: {activeCase.id}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Destino Atual ({missionState.currentCityIndex + 1}/6):{' '}
                    <strong className="text-slate-200">{currentDestination.city}</strong> {currentDestination.flag} ({currentDestination.country})
                  </div>
                </div>
              </div>

              {/* Mission Calculated Time & Capture Countdown Display */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">⏱️ Viagens:</span>
                  <span className="text-slate-200 font-bold">{formatMissionTime(missionState.travelTimeMinutes)} h</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500">Perícia:</span>
                  <span className="text-slate-200 font-bold">{formatMissionTime(missionState.investigationTimeMinutes)} h</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400 font-bold">Total: {formatMissionTime(missionState.travelTimeMinutes + missionState.investigationTimeMinutes)} h</span>
                </div>

                {/* Capture Phase Button / Alert */}
                {missionState.capturePhaseActive ? (
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setCaptureModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg animate-pulse shadow-lg shadow-red-950 font-mono"
                  >
                    <Timer className="w-4 h-4 text-red-200" />
                    <span>PERSEGUIÇÃO ATIVA: {formatMissionTime(Math.floor(missionState.captureTimeRemainingSeconds / 60))}:{String(missionState.captureTimeRemainingSeconds % 60).padStart(2, '0')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setCaptureModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-red-900/60 border border-slate-700 hover:border-red-600 text-slate-200 hover:text-red-200 font-bold rounded-lg transition-colors font-mono"
                  >
                    <Target className="w-3.5 h-3.5 text-red-400" />
                    Solicitar Prisão
                  </button>
                )}
              </div>
            </div>

            {/* Split Screen: Left = Dossier & Witness / Right = Tactical World Map & Mestre AI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (7 cols): Clues, Document, Witness Interrogation */}
              <div className="lg:col-span-7 space-y-4">
                {/* Navigation sub-tabs inside Investigation */}
                <div className="flex border-b border-slate-800 bg-slate-900 rounded-xl p-1 gap-1 text-xs font-mono">
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setInvestigationTab('clues');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                      investigationTab === 'clues' ? 'bg-cyan-600 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🔎 Pistas & Evidências
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setInvestigationTab('witness');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                      investigationTab === 'witness' ? 'bg-cyan-600 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👤 Interrogatório Local
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setInvestigationTab('mestre');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                      investigationTab === 'mestre' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🤖 Mestre IA
                  </button>
                </div>

                <div className="min-h-[480px]">
                  {investigationTab === 'clues' && (
                    <EvidenceDossier
                      clues={currentDestination.clues}
                      document={currentDestination.document}
                      voiceSynthEnabled={settings.voiceSynth}
                    />
                  )}

                  {investigationTab === 'witness' && (
                    <WitnessRoom
                      witness={currentDestination.witness}
                      suspectName={activeCase.suspect.name}
                      city={currentDestination.city}
                      evidenceDoc={currentDestination.document}
                      interrogationLog={missionState.interrogationLog}
                      onAddLog={(entry) => {
                        setMissionState(prev => ({
                          ...prev,
                          interrogationLog: [...prev.interrogationLog, entry],
                        }));
                      }}
                      onQuestionAsked={(costMins) => {
                        setMissionState(prev => ({
                          ...prev,
                          investigationTimeMinutes: prev.investigationTimeMinutes + costMins,
                        }));
                      }}
                    />
                  )}

                  {investigationTab === 'mestre' && (
                    <MestreAiPanel
                      currentCity={currentDestination.city}
                      nextCityName={nextDestination ? nextDestination.city : currentDestination.city}
                      difficulty={activeCase.difficulty}
                      recentClues={currentDestination.clues}
                      hintsUsed={missionState.hintsUsed}
                      voiceSynthEnabled={settings.voiceSynth}
                      onHintRequested={() => {
                        setMissionState(prev => ({
                          ...prev,
                          hintsUsed: prev.hintsUsed + 1,
                          investigationTimeMinutes: prev.investigationTimeMinutes + 15,
                        }));
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Embedded Tactical Map & Quick Flight Departure Board */}
              <div className="lg:col-span-5 space-y-4">
                <WorldMap
                  currentCity={currentDestination}
                  allDestinations={activeCase.destinations}
                  visitedIndices={missionState.visitedCityIndices}
                  onTravelToCity={handleTravelToCity}
                  isTraveling={isTraveling}
                  travelAnimationCity={travelCityName}
                  reduceMotion={settings.reduceMotion}
                />

                {/* Departure Board / Suspect Profile Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-slate-500 uppercase">Ficha Tática do Suspeito</span>
                    <span className="text-cyan-400 font-bold">{activeCase.suspect.codename}</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Nome:</span> {activeCase.suspect.name} ({activeCase.suspect.age} anos)</div>
                    <div><span className="text-slate-500">Ocupação:</span> {activeCase.suspect.profession}</div>
                    <div className="text-[11px] text-slate-400 italic">"{activeCase.suspect.appearance}"</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Crime Investigado:</span>
                    <span className="text-amber-400 font-bold">{activeCase.crime.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. FULLSCREEN TACTICAL MAP VIEW */}
        {activeView === 'MAP' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between font-mono text-xs bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={navigateBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 hover:text-cyan-300 font-bold cursor-pointer transition-all"
                  title="Voltar à Página Anterior"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={navigateHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-cyan-300 font-bold cursor-pointer transition-all"
                  title="Página Inicial"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>Início</span>
                </button>
              </div>
              <span className="text-slate-400">Terminal de Vigilância Global & Rotas Aéreas</span>
            </div>

            <WorldMap
              currentCity={currentDestination || {
                order: 1,
                city: 'Brasília',
                country: 'Brasil',
                flag: '🇧🇷',
                airportCode: 'BSB',
                lat: -15.7975,
                lng: -47.8919,
                description: 'Sede Central da Agência',
                travelTimeMinutes: 0,
                witness: { name: 'Comando Central', role: 'Diretor', statement: '', question1: '', answer1: '', question2: '', answer2: '', evidenceReaction: '' },
                clues: [],
              }}
              allDestinations={activeCase ? activeCase.destinations : []}
              visitedIndices={activeCase ? missionState.visitedCityIndices : [0]}
              onTravelToCity={handleTravelToCity}
              isTraveling={isTraveling}
              travelAnimationCity={travelCityName}
              reduceMotion={settings.reduceMotion}
            />
          </div>
        )}

        {/* 5. MISSION RESULT DEBRIEFING */}
        {activeView === 'RESULT' && latestResult && (
          <MissionResultView
            result={latestResult}
            onNextMission={() => setNewOpModalOpen(true)}
            onViewArchives={() => navigateTo('ARCHIVES')}
            onViewRanking={() => navigateTo('RANKING')}
            onBackToHq={() => navigateTo('HQ')}
          />
        )}

        {/* 6. LEADERBOARD VIEW */}
        {activeView === 'RANKING' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={navigateBack}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 rounded-lg text-slate-200 hover:text-cyan-300 font-bold cursor-pointer transition-all shadow-sm"
                title="Página Anterior"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Voltar</span>
              </button>
              <button
                onClick={navigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 rounded-lg text-slate-300 hover:text-cyan-300 font-bold cursor-pointer transition-all shadow-sm"
                title="Página Inicial (Início)"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Página Inicial</span>
              </button>
              <button
                onClick={() => navigateTo('HQ')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 font-bold cursor-pointer transition-all"
              >
                <span>Central (QG)</span>
              </button>
            </div>
            <LeaderboardView
              entries={StorageService.getLeaderboard()}
              currentAgentCodename={profile.codename}
            />
          </div>
        )}

        {/* 7. ARCHIVED CASES VIEW */}
        {activeView === 'ARCHIVES' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={navigateBack}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 rounded-lg text-slate-200 hover:text-cyan-300 font-bold cursor-pointer transition-all shadow-sm"
                title="Página Anterior"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Voltar</span>
              </button>
              <button
                onClick={navigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800 rounded-lg text-slate-300 hover:text-cyan-300 font-bold cursor-pointer transition-all shadow-sm"
                title="Página Inicial (Início)"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Página Inicial</span>
              </button>
              <button
                onClick={() => navigateTo('HQ')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 font-bold cursor-pointer transition-all"
              >
                <span>Central (QG)</span>
              </button>
            </div>
            <ArchivedCasesView
              solvedCases={solvedCases}
              archivedCases={archivedCases}
            />
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Agent Profile / Badge Modal */}
      {badgeModalOpen && (
        <AgentBadgeModal
          profile={profile}
          isInitialSetup={isInitialProfileSetup}
          onSave={(updated) => {
            setProfile(updated);
            StorageService.updateLeaderboardWithAgent(updated);
            setBadgeModalOpen(false);
            setIsInitialProfileSetup(false);
          }}
          onClose={() => setBadgeModalOpen(false)}
        />
      )}

      {/* 2. New Operation Selection Modal */}
      {newOpModalOpen && (
        <NewOperationModal
          unlockedStages={profile.unlockedStages}
          isGenerating={isGeneratingCase}
          onSelectOperation={handleStartOperation}
          onClose={() => setNewOpModalOpen(false)}
        />
      )}

      {/* 3. Capture Authorization Protocol Modal (20:00 Timer) */}
      {captureModalOpen && activeCase && (
        <CaptureModal
          caseData={activeCase}
          timeRemainingSeconds={missionState.captureTimeRemainingSeconds}
          onConfirmCapture={handleConfirmCapture}
          onClose={() => setCaptureModalOpen(false)}
          onTimeExpired={handleCaptureTimeExpired}
        />
      )}

      {/* 4. Multiplayer / Coop Mode Modal */}
      {multiplayerModalOpen && (
        <MultiplayerModal
          onClose={() => setMultiplayerModalOpen(false)}
          onStartMode={(mode, role) => {
            setMultiplayerModalOpen(false);
            handleStartOperation('medium', 1, false);
          }}
        />
      )}

      {/* 5. Settings & Accessibility Modal */}
      {settingsModalOpen && (
        <SettingsModal
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            StorageService.saveSettings(newSettings);
          }}
          onClose={() => setSettingsModalOpen(false)}
          onResetProgress={handleResetAllProgress}
        />
      )}

      {/* 6. Game Manual Modal */}
      <GameManualModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      />

      {/* 7. In-App Tactical Alert Banner */}
      {tacticalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`relative w-full max-w-md bg-slate-900 border-2 rounded-2xl p-6 shadow-2xl font-mono text-xs ${
            tacticalAlert.type === 'error' ? 'border-red-500/80 shadow-red-950/60' : 'border-amber-500/80 shadow-amber-950/60'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className={`w-6 h-6 shrink-0 ${
                tacticalAlert.type === 'error' ? 'text-red-400' : 'text-amber-400'
              }`} />
              <div>
                <h4 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
                  {tacticalAlert.title}
                </h4>
                <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                  {tacticalAlert.message}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setTacticalAlert(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold uppercase rounded-lg transition-colors"
              >
                Ciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
