import { CaseData, DifficultyLevel, Witness } from '../types/game.ts';
import { generateProceduralCase, getProceduralHint, getProceduralWitnessResponse } from './proceduralGenerator.ts';

export const ApiClient = {
  async generateCase(
    difficulty: DifficultyLevel,
    stageNumber: number,
    agentNationality: string,
    agentCodename: string
  ): Promise<{ caseData: CaseData; source: string }> {
    try {
      const res = await fetch('/api/gemini/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, stageNumber, agentNationality, agentCodename }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.caseData && data.caseData.destinations?.length >= 4) {
        return data;
      }
      throw new Error('Invalid case response');
    } catch (err) {
      console.warn('Falling back to local procedural case generator:', err);
      const fallback = generateProceduralCase(difficulty, stageNumber, agentNationality);
      return { caseData: fallback, source: 'procedural-client' };
    }
  },

  async interrogateWitness(
    suspectName: string,
    witness: Witness,
    question: string,
    evidenceShown?: any,
    city: string = ''
  ): Promise<string> {
    try {
      const res = await fetch('/api/gemini/witness-interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspectName, witness, question, evidenceShown, city }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return data.reply || getProceduralWitnessResponse(witness, question, evidenceShown);
    } catch (err) {
      return getProceduralWitnessResponse(witness, question, evidenceShown);
    }
  },

  async getMestreHint(
    currentCity: string,
    nextTargetCity: string,
    level: 1 | 2 | 3,
    recentClues: any[] = []
  ): Promise<string> {
    try {
      const res = await fetch('/api/gemini/mestre-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCity, nextTargetCity, level, recentClues }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return data.hint || getProceduralHint(currentCity, nextTargetCity, level);
    } catch (err) {
      return getProceduralHint(currentCity, nextTargetCity, level);
    }
  },
};
