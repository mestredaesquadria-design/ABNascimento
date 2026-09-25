import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client with required header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fallback procedural generator if Gemini API key is missing, rate-limited, or network issue
import { generateProceduralCase, getProceduralHint, getProceduralWitnessResponse } from './src/services/proceduralGenerator.ts';

// 1. Generate Case Endpoint
app.post('/api/gemini/generate-case', async (req, res) => {
  const { difficulty = 'medium', stageNumber = 1, agentNationality = 'Brasil', agentCodename = 'Agente X' } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const fallbackCase = generateProceduralCase(difficulty, stageNumber, agentNationality);
    return res.json({ caseData: fallbackCase, source: 'procedural' });
  }

  try {
    const destinationsCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    const prompt = `Você é o Diretor da Agência Internacional de Inteligência (AGENTE X).
Crie um caso de investigação internacional completo com o SISTEMA DE PISTAS PROGRESSIVAS para o agente ${agentCodename} (${agentNationality}).
Dificuldade: ${difficulty.toUpperCase()} (${destinationsCount} cidades/pistas em sequência progressiva).
Etapa da Campanha: ${stageNumber}.

REGRAS RÍGIDAS DO SISTEMA DE PISTAS PROGRESSIVAS:
1. Existe UMA solução única e inequívoca.
2. O suspeito viaja por exatamente ${destinationsCount} cidades internacionais reais e distintas em ordem cronológica estrita.
3. CADA CIDADE deve conter sua pista única que indica para onde o suspeito fugiu (moeda local, monumento famoso, idioma, costumes, código de aeroporto).
4. O jogador só descobre uma pista por vez: a pista da cidade 1 indica a cidade 2; a pista da cidade 2 indica a cidade 3, até a cidade ${destinationsCount} que é o esconderijo final.
5. A última cidade (${destinationsCount}) é o esconderijo final onde o suspeito está preste a fugir definitivamente.
6. Deve haver UMA evidência-chave irrefutável que prova a identidade do suspeito no final.
7. Responda em Português do Brasil com tom tático de espionagem moderna.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            operationName: { type: Type.STRING },
            briefing: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            stageNumber: { type: Type.INTEGER },
            suspect: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                codename: { type: Type.STRING },
                age: { type: Type.INTEGER },
                profession: { type: Type.STRING },
                appearance: { type: Type.STRING },
                motive: { type: Type.STRING },
                avatarType: { type: Type.STRING },
              },
              required: ['name', 'codename', 'age', 'profession', 'appearance', 'motive'],
            },
            crime: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                stolenItemOrSecret: { type: Type.STRING },
                estimatedValue: { type: Type.STRING },
              },
              required: ['title', 'category', 'description', 'stolenItemOrSecret'],
            },
            keyEvidence: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
              },
              required: ['title', 'description'],
            },
            destinations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  order: { type: Type.INTEGER },
                  city: { type: Type.STRING },
                  country: { type: Type.STRING },
                  flag: { type: Type.STRING },
                  airportCode: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  witness: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      statement: { type: Type.STRING },
                      question1: { type: Type.STRING },
                      answer1: { type: Type.STRING },
                      question2: { type: Type.STRING },
                      answer2: { type: Type.STRING },
                      evidenceReaction: { type: Type.STRING },
                    },
                    required: ['name', 'role', 'statement', 'question1', 'answer1', 'question2', 'answer2', 'evidenceReaction'],
                  },
                  clues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        title: { type: Type.STRING },
                        text: { type: Type.STRING },
                        source: { type: Type.STRING },
                        hintToNextCity: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'type', 'title', 'text', 'source', 'hintToNextCity'],
                    },
                  },
                  document: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      issuer: { type: Type.STRING },
                      date: { type: Type.STRING },
                    },
                  },
                },
                required: ['order', 'city', 'country', 'airportCode', 'lat', 'lng', 'description', 'witness', 'clues'],
              },
            },
          },
          required: ['id', 'operationName', 'briefing', 'difficulty', 'stageNumber', 'suspect', 'crime', 'keyEvidence', 'destinations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const minDests = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    if (!parsed.destinations || parsed.destinations.length < minDests) {
      throw new Error(`Case generation yielded incomplete destinations: ${parsed.destinations?.length} vs ${minDests}`);
    }

    // Enrich destinations with photo and cultural data from WORLD_CITIES if absent
    parsed.destinations = parsed.destinations.map((d: any, idx: number) => {
      const match = WORLD_CITIES.find(c => c.city.toLowerCase() === d.city.toLowerCase());
      return {
        ...d,
        order: idx + 1,
        flag: match?.flag || d.flag || '📍',
        landmark: match?.landmark || d.landmark || 'Marco Arquitetônico Central',
        culturalFact: match?.culturalFact || d.culturalFact || 'Gastronomia e costumes regionais marcantes.',
        historicFact: match?.historicFact || d.historicFact || 'Centro histórico com séculos de tradição.',
        geoInfo: match?.geoInfo || d.geoInfo || 'Posição estratégica na malha aérea internacional.',
        photoUrl: match?.image || d.photoUrl,
        currency: match?.currency || d.currency || 'Moeda Local',
        language: match?.language || d.language || 'Oficial',
      };
    });

    return res.json({ caseData: parsed, source: 'gemini' });
  } catch (err: any) {
    console.error('Gemini Case Generation error:', err?.message || err);
    const fallbackCase = generateProceduralCase(difficulty, stageNumber, agentNationality);
    return res.json({ caseData: fallbackCase, source: 'procedural-fallback' });
  }
});

// 2. Witness Interrogation Dynamic AI Response
app.post('/api/gemini/witness-interrogate', async (req, res) => {
  const { suspectName, witness, question, evidenceShown, city, caseContext } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const reply = getProceduralWitnessResponse(witness, question, evidenceShown);
    return res.json({ reply });
  }

  try {
    const prompt = `Você é uma testemunha chamada ${witness.name}, que trabalha como ${witness.role} em ${city}.
Contexto do caso: Um indivíduo suspeito chamado ${suspectName} passou recentemente por aqui.
O Agente X fez a seguinte pergunta: "${question}".
${evidenceShown ? `O Agente X apresentou esta evidência: "${evidenceShown.title}: ${evidenceShown.description || evidenceShown.content}".` : ''}

Responda em 2 a 3 frases realistas, com tom natural, sem revelar diretamente toda a solução, mantendo o suspense de uma investigação policial internacional. Seja consistente com o papel da testemunha.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ reply: response.text?.trim() || 'Não tenho certeza, agente... vi alguém com essa descrição saindo com pressa.' });
  } catch (err) {
    const reply = getProceduralWitnessResponse(witness, question, evidenceShown);
    return res.json({ reply });
  }
});

// 3. Mestre IA Gradual Hint
app.post('/api/gemini/mestre-hint', async (req, res) => {
  const { currentCity, nextTargetCity, level = 1, recentClues = [] } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const hint = getProceduralHint(currentCity, nextTargetCity, level);
    return res.json({ hint });
  }

  try {
    const levelGuide = level === 1 
      ? 'DICA NÍVEL 1: Apenas orientação geral sobre análise de pistas e métodos de dedução, sem citar locais diretamente.' 
      : level === 2 
      ? 'DICA NÍVEL 2: Destaque traços culturais, clima, moedas ou registros de transporte encontrados na pista sem dizer o nome exato da cidade.' 
      : 'DICA NÍVEL 3: Quase direcionamento sutil (ex: "Os registros apontam para uma capital europeia famosa pelo Rio Sena e pela Torre"). NUNCA DIGA "Vá para Paris".';

    const prompt = `Você é o "Mestre IA", assistente virtual de inteligência da Agência AGENTE X.
O jogador está atualmente em ${currentCity} e precisa descobrir para onde o suspeito viajou (próximo destino verdadeiro é ${nextTargetCity}).
Pistas descobertas recentemente: ${JSON.stringify(recentClues.slice(0, 3))}

Regra Absoluta: NUNCA diga diretamente "Vá para [Nome da Cidade]".
Siga estritamente este nível de dica:
${levelGuide}
Responda em 1 ou 2 frases curtas, táticas e encorajadoras.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ hint: response.text?.trim() || getProceduralHint(currentCity, nextTargetCity, level) });
  } catch (err) {
    const hint = getProceduralHint(currentCity, nextTargetCity, level);
    return res.json({ hint });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite or Static dist serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AGENTE X] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
