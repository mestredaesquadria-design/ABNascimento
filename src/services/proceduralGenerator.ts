import { CaseData, DifficultyLevel, Destination, Clue, Witness, CaseDocument } from '../types/game.ts';

// Comprehensive international cities database with coordinates and cultural identifiers
export const WORLD_CITIES = [
  { city: 'Nova York', country: 'Estados Unidos', flag: '🇺🇸', airportCode: 'JFK', lat: 40.7128, lng: -74.0060, currency: 'Dólar (USD)', landmark: 'Manhattan', language: 'Inglês' },
  { city: 'Paris', country: 'França', flag: '🇫🇷', airportCode: 'CDG', lat: 48.8566, lng: 2.3522, currency: 'Euro (EUR)', landmark: 'Torre Eiffel e Rio Sena', language: 'Francês' },
  { city: 'Roma', country: 'Itália', flag: '🇮🇹', airportCode: 'FCO', lat: 41.9028, lng: 12.4964, currency: 'Euro (EUR)', landmark: 'Coliseu', language: 'Italiano' },
  { city: 'Cairo', country: 'Egito', flag: '🇪🇬', airportCode: 'CAI', lat: 30.0444, lng: 31.2357, currency: 'Libra Egípcia (EGP)', landmark: 'Pirâmides de Gizé', language: 'Árabe' },
  { city: 'Tóquio', country: 'Japão', flag: '🇯🇵', airportCode: 'HND', lat: 35.6762, lng: 139.6503, currency: 'Iene (JPY)', landmark: 'Shibuya e Monte Fuji', language: 'Japonês' },
  { city: 'Rio de Janeiro', country: 'Brasil', flag: '🇧🇷', airportCode: 'GIG', lat: -22.9068, lng: -43.1729, currency: 'Real (BRL)', landmark: 'Cristo Redentor e Pão de Açúcar', language: 'Português' },
  { city: 'Londres', country: 'Reino Unido', flag: '🇬🇧', airportCode: 'LHR', lat: 51.5074, lng: -0.1278, currency: 'Libra Esterlina (GBP)', landmark: 'Big Ben e Rio Tâmisa', language: 'Inglês' },
  { city: 'Berlim', country: 'Alemanha', flag: '🇩🇪', airportCode: 'BER', lat: 52.5200, lng: 13.4050, currency: 'Euro (EUR)', landmark: 'Portão de Brandemburgo', language: 'Alemão' },
  { city: 'Madri', country: 'Espanha', flag: '🇪🇸', airportCode: 'MAD', lat: 40.4168, lng: -3.7038, currency: 'Euro (EUR)', landmark: 'Palácio Real', language: 'Espanhol' },
  { city: 'Lisboa', country: 'Portugal', flag: '🇵🇹', airportCode: 'LIS', lat: 38.7223, lng: -9.1393, currency: 'Euro (EUR)', landmark: 'Torre de Belém e Rio Tejo', language: 'Português' },
  { city: 'Zurique', country: 'Suíça', flag: '🇨🇭', airportCode: 'ZRH', lat: 47.3769, lng: 8.5417, currency: 'Franco Suíço (CHF)', landmark: 'Lago de Zurique e Bancos Privados', language: 'Alemão' },
  { city: 'Dubai', country: 'Emirados Árabes', flag: '🇦🇪', airportCode: 'DXB', lat: 25.2048, lng: 55.2708, currency: 'Dirham (AED)', landmark: 'Burj Khalifa', language: 'Árabe' },
  { city: 'Singapura', country: 'Singapura', flag: '🇸🇬', airportCode: 'SIN', lat: 1.3521, lng: 103.8198, currency: 'Dólar de Singapura (SGD)', landmark: 'Marina Bay', language: 'Inglês' },
  { city: 'Sydney', country: 'Austrália', flag: '🇦🇺', airportCode: 'SYD', lat: -33.8688, lng: 151.2093, currency: 'Dólar Australiano (AUD)', landmark: 'Opera House', language: 'Inglês' },
  { city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', airportCode: 'EZE', lat: -34.6037, lng: -58.3816, currency: 'Peso Argentino (ARS)', landmark: 'Obelisco e Casa Rosada', language: 'Espanhol' },
  { city: 'Cidade do Cabo', country: 'África do Sul', flag: '🇿🇦', airportCode: 'CPT', lat: -33.9249, lng: 18.4241, currency: 'Rand (ZAR)', landmark: 'Table Mountain', language: 'Inglês/Africâner' },
  { city: 'Istambul', country: 'Turquia', flag: '🇹🇷', airportCode: 'IST', lat: 41.0082, lng: 28.9784, currency: 'Lira Turca (TRY)', landmark: 'Estreito de Bósforo e Santa Sofia', language: 'Turco' },
  { city: 'Seul', country: 'Coreia do Sul', flag: '🇰🇷', airportCode: 'ICN', lat: 37.5665, lng: 126.9780, currency: 'Won (KRW)', landmark: 'Torre N Seoul e Palácio Gyeongbokgung', language: 'Coreano' },
];

export const SUSPECTS_TEMPLATES = [
  {
    name: 'Viktor Vance',
    codename: 'Fantasma de Prata',
    age: 42,
    profession: 'Engenheiro Quântico e Ex-Consultor de Defesa',
    appearance: 'Alto, cabelos grisalhos curtos, sobretudo escuro e cicatriz sutil na mão esquerda.',
    motive: 'Vender algoritmos quânticos de quebra de criptografia para um sindicato anônimo no mercado negro.',
    avatarType: 'tech_broker'
  },
  {
    name: 'Elena Rostova',
    codename: 'Camaleoa Vermelha',
    age: 34,
    profession: 'Curadora Internacional de Artes e Falsificadora Mestre',
    appearance: 'Estatura média, olhos castanhos expressivos, costuma usar óculos escuros de grife e lenços de seda.',
    motive: 'Substituir artefatos históricos originais de valor incalculável por réplicas perfeitas e financiar sua rede.',
    avatarType: 'art_thief'
  },
  {
    name: 'Darius Thorne',
    codename: 'Arquiteto Sombra',
    age: 48,
    profession: 'Ex-Diretor de Telecomunicações Globais',
    appearance: 'Porte atlético, cavanhaque impecável, terno de corte italiano e relógio analógico de titânio.',
    motive: 'Interceptar cabos submarinos transatlânticos para chantagear conglomerados industriais.',
    avatarType: 'mastermind'
  },
  {
    name: 'Camila Alencar',
    codename: 'Orquídea Negra',
    age: 29,
    profession: 'Especialista em Criptografia e Infiltração Biométrica',
    appearance: 'Cabelos pretos com mechas prateadas, jaqueta de couro resistente e fones sem fio camuflados.',
    motive: 'Extrair o banco de dados mestre de identidades diplomáticas antes que seja revogado.',
    avatarType: 'infiltrator'
  },
  {
    name: 'Kaito Moriyama',
    codename: 'Ronin Digital',
    age: 38,
    profession: 'Arquiteto de Sistemas de Satélites Órbita Baixa',
    appearance: 'Postura metódica, óculos de aro fino prateado, mochila tática blindada.',
    motive: 'Desviar a telemetria de satélites climáticos para favorecer operações offshore ilegais.',
    avatarType: 'satellite_hacker'
  },
];

export const CRIMES_TEMPLATES = [
  {
    title: 'Furto do Microchip Quântico Aethelgard',
    category: 'Espionagem Tecnológica',
    description: 'Um protótipo de computação quântica de 512 qubits capaz de descriptografar qualquer chave militar foi subtraído do laboratório de Genebra.',
    stolenItemOrSecret: 'Protótipo Microchip Quântico Aethelgard NX-7',
    estimatedValue: '$ 120.000.000'
  },
  {
    title: 'Substituição do Códice de Alexandria',
    category: 'Contrabando de Relíquia',
    description: 'Um pergaminho de 2.200 anos contendo coordenadas de fundações históricas foi substituído por uma réplica com tintas envelhecidas artificialmente.',
    stolenItemOrSecret: 'Fragmento Original do Códice de Alexandria',
    estimatedValue: '$ 45.000.000'
  },
  {
    title: 'Desvio da Chave Criptográfica Global SWIFT-X',
    category: 'Fraude Financeira Internacional',
    description: 'Uma sequência de códigos mestres de compensação bancária entre bancos centrais foi desviada durante manutenção sigilosa.',
    stolenItemOrSecret: 'Módulo de Hardware Criptográfico HSM-SWIFT',
    estimatedValue: '$ 300.000.000 em fluxos'
  },
  {
    title: 'Sabotagem da Matriz de Satélites Helios',
    category: 'Sabotagem Aeroespacial',
    description: 'Um módulo de direcionamento de propulsores orbitais foi corrompido, permitindo controle remoto não autorizado da rede de vigilância.',
    stolenItemOrSecret: 'Transmissor de Calibração Orbital Helios-Prime',
    estimatedValue: 'Segredo de Estado'
  },
];

// Calculate Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Convert distance to realistic flight mission time in minutes
export function calculateFlightDurationMinutes(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dist = calculateDistance(lat1, lon1, lat2, lon2);
  // Average jet speed ~850 km/h + 40 mins for takeoff/landing/customs clearance
  const flightHours = (dist / 850) + 0.6;
  return Math.max(75, Math.round(flightHours * 60));
}

// Format minutes into HH:MM display
export function formatMissionTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function generateProceduralCase(
  difficulty: DifficultyLevel = 'medium',
  stageNumber: number = 1,
  agentNationality: string = 'Brasil'
): CaseData {
  const caseId = `AX-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const suspectTemplate = SUSPECTS_TEMPLATES[Math.floor(Math.random() * SUSPECTS_TEMPLATES.length)];
  const crimeTemplate = CRIMES_TEMPLATES[Math.floor(Math.random() * CRIMES_TEMPLATES.length)];

  // Shuffle cities and pick 6 distinct international destinations
  const shuffledCities = [...WORLD_CITIES].sort(() => Math.random() - 0.5);
  const selectedCities = shuffledCities.slice(0, 6);

  const cluesPerCity = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

  const operationNames = [
    'OPERAÇÃO ECLIPSE SOMBRIO',
    'OPERAÇÃO VÉU DE SEDA',
    'OPERAÇÃO AURORA VERMELHA',
    'OPERAÇÃO RELÂMPAGO DE PRATA',
    'OPERAÇÃO VÓRTICE SECRETO',
    'OPERAÇÃO PROTOCOLO ZERO',
    'OPERAÇÃO ÁGUIA DA NOITE',
    'OPERAÇÃO FÊNIX DOURADA',
    'OPERAÇÃO SENTINELA GLOBAL',
    'OPERAÇÃO HORIZONTE DE FERRO',
  ];
  const operationName = operationNames[(stageNumber - 1) % operationNames.length] || `OPERAÇÃO SIGMA ${stageNumber}`;

  const keyEvidenceTypes = [
    { title: `Registro Criptográfico do Dispositivo ${caseId}`, type: 'electronic', description: `Log digital interceptado de conexão de rádio com a assinatura única do codinome '${suspectTemplate.codename}'.` },
    { title: `Passaporte Diplomático Adulterado de ${suspectTemplate.name}`, type: 'document', description: `Documento com carimbos falsificados exatamente nas 6 cidades da rota da fuga.` },
    { title: `Comprovante de Cofre Seguro em ${selectedCities[5].city}`, type: 'financial', description: `Contrato de custódia assinado à mão sob pseudônimo com a descrição exata do item '${crimeTemplate.stolenItemOrSecret}'.` },
  ];
  const keyEvidence = keyEvidenceTypes[Math.floor(Math.random() * keyEvidenceTypes.length)];

  const destinations: Destination[] = selectedCities.map((current, index) => {
    const nextCity = index < 5 ? selectedCities[index + 1] : null;
    const prevCity = index > 0 ? selectedCities[index - 1] : null;

    const travelTime = prevCity 
      ? calculateFlightDurationMinutes(prevCity.lat, prevCity.lng, current.lat, current.lng)
      : 0;

    // Build witness
    const witnessRoles = [
      { name: 'Marcus Silva', role: 'Gerente da Sala VIP do Aeroporto' },
      { name: 'Claire Fontaine', role: 'Recepcionista do Hotel Internacional' },
      { name: 'Tariq Hassan', role: 'Dono de Cybercafé e Câmbio' },
      { name: 'Kenji Sato', role: 'Operador de Torre de Controle Ferroviário' },
      { name: 'Sophia Rossi', role: 'Guia do Museu Histórico' },
      { name: 'Alejandro Ramos', role: 'Motorista de Transporte Executivo' },
    ];
    const witnessData = witnessRoles[index % witnessRoles.length];

    let witnessStatement = '';
    let nextCityClueText = '';
    if (nextCity) {
      witnessStatement = `O indivíduo passou por aqui com bagagem compacta e parecia apressado. Perguntou insistentemente sobre o fuso horário e voos partindo rumo a um destino com ${nextCity.landmark}.`;
      nextCityClueText = `Uma anotação rápida deixada no balcão continha a moeda ${nextCity.currency} e uma menção ao terminal aéreo ${nextCity.airportCode}.`;
    } else {
      witnessStatement = `O indivíduo alugou um refúgio isolado aqui mesmo em ${current.city}. Ele disse que aguardaria o comprador final nas próximas 20 horas.`;
      nextCityClueText = `Fontes locais confirmam que ele está escondido nesta cidade e prepara a transferência definitiva do item.`;
    }

    const clues: Clue[] = [
      {
        id: `clue-${index}-1`,
        type: 'witness',
        title: `Depoimento de ${witnessData.name}`,
        text: witnessStatement,
        source: witnessData.role,
        hintToNextCity: true,
      },
      {
        id: `clue-${index}-2`,
        type: 'surveillance',
        title: `Gravação de Câmera de Segurança (${current.airportCode})`,
        text: `As câmeras capturaram uma pessoa com características: ${suspectTemplate.appearance}. Usava fones discretos e portava pasta à prova de raios-X.`,
        source: 'Circuito Fechado de Vigilância',
        hintToNextCity: false,
      },
      {
        id: `clue-${index}-3`,
        type: 'document',
        title: `Registro de Transporte & Bilhete`,
        text: nextCityClueText,
        source: 'Terminal Internacional de Embarque',
        hintToNextCity: true,
      },
    ];

    if (cluesPerCity >= 5) {
      clues.push({
        id: `clue-${index}-4`,
        type: 'forensic',
        title: `Análise de Resíduos no Balcão de Câmbio`,
        text: nextCity 
          ? `Foram trocadas quantias expressivas em ${nextCity.currency}. O recibo descartado continha referências ao idioma ${nextCity.language}.`
          : `Foram encontrados vestígios de equipamentos de codificação e embalagens térmicas para o item '${crimeTemplate.stolenItemOrSecret}'.`,
        source: 'Perícia Forense da Agência',
        hintToNextCity: Boolean(nextCity),
      });

      clues.push({
        id: `clue-${index}-5`,
        type: 'wiretap',
        title: `Interceptação de Chamada Criptografada`,
        text: nextCity
          ? `"Estou deixando ${current.city} agora. Minha próxima parada tem vista para ${nextCity.landmark}. Mantenha a linha segura aberta."`
          : `"Cheguei ao porto seguro final. Se a Agência não me capturar nos próximos minutos, o carregamento cruza a fronteira."`,
        source: 'Escuta Tática Sigilosa',
        hintToNextCity: Boolean(nextCity),
      });
    }

    if (cluesPerCity >= 7) {
      clues.push({
        id: `clue-${index}-6`,
        type: 'document',
        title: `Manifesto de Carga Aduaneira`,
        text: `Declaração alfandegária suspeita sob o código do sindicato '${suspectTemplate.codename}'. O volume estava registrado para trânsito com selo prioritário.`,
        source: 'Alfândega Internacional',
        hintToNextCity: false,
      });

      clues.push({
        id: `clue-${index}-7`,
        type: 'surveillance',
        title: `Relatório de Tráfego de Redes Virtuais`,
        text: nextCity 
          ? `Dispositivo móvel do suspeito conectou brevemente à antena repetidora com coordenadas apontando na rota em direção a ${nextCity.country}.`
          : `O sinal do transmissor está ativo a menos de 5 km do centro de ${current.city}. A janela de captura é imediata.`,
        source: 'Divisão de Ciberinteligência',
        hintToNextCity: Boolean(nextCity),
      });
    }

    const doc: CaseDocument = {
      type: index === 0 ? 'police_report' : index === 5 ? 'bank_receipt' : 'boarding_pass',
      title: index === 0 
        ? `Boletim Confidencial de Ocorrência — ${current.city}`
        : index === 5
        ? `Recibo de Custódia e Aluguel de Hangar — ${current.city}`
        : `Cartão de Embarque Recuperado — Voo ${current.airportCode} ➔ ${nextCity ? nextCity.airportCode : 'FINAL'}`,
      content: nextCity 
        ? `Passageiro registrado como viajante frequente. Partida autorizada para ${nextCity.city} (${nextCity.country}). Horário de embarque condizente com a fuga.`
        : `Documento de recebimento do pacote misterioso selado com chave quântica. Localização: Zona Portuária de ${current.city}.`,
      issuer: `Autoridade Aeroportuária de ${current.city}`,
      date: '2026-09-24',
      serialNumber: `DOC-${current.airportCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      details: {
        Origem: current.city,
        Destino: nextCity ? nextCity.city : 'Ponto Cego',
        Status: 'Verificado',
      },
    };

    const witness: Witness = {
      name: witnessData.name,
      role: witnessData.role,
      statement: witnessStatement,
      question1: 'Você notou para onde ele pretendia viajar?',
      answer1: nextCity 
        ? `Sim! Ele estava com um guia turístico e consultava a taxa de câmbio de ${nextCity.currency}, citando que precisava pousar perto de ${nextCity.landmark}.`
        : `Ele disse que este era seu ponto de chegada final, onde entregaria a carga.`,
      question2: 'Havia algo chamativo na aparência dele?',
      answer2: `Exatamente como no relatório: ${suspectTemplate.appearance}. Falava de forma calma, porém olhava frequentemente para o relógio.`,
      evidenceReaction: `Ao ver esta evidência, a testemunha confirma: "Sem dúvida! Esse é o exato código e pasta que ele carregava."`,
    };

    return {
      order: index + 1,
      city: current.city,
      country: current.country,
      flag: current.flag,
      airportCode: current.airportCode,
      lat: current.lat,
      lng: current.lng,
      description: `Metrópole estratégica com importante entroncamento logístico internacional. ${current.landmark}.`,
      travelTimeMinutes: travelTime,
      witness,
      clues,
      document: doc,
    };
  });

  return {
    id: caseId,
    operationName,
    briefing: `URGENTE PARA AGENTE X: Ocorreu o '${crimeTemplate.title}'. O principal suspeito é ${suspectTemplate.name} ('${suspectTemplate.codename}'). As últimas informações apontam que ele iniciou sua fuga a partir de ${selectedCities[0].city} e está se deslocando por rotas internacionais. Siga as pistas, interrogue contatos locais e capture o suspeito antes que o tempo expire!`,
    difficulty,
    stageNumber,
    suspect: suspectTemplate,
    crime: crimeTemplate,
    keyEvidence,
    destinations,
    status: 'active',
    startedAt: new Date().toISOString(),
  };
}

export function getProceduralHint(currentCity: string, nextCityName: string, level: number): string {
  const targetCityData = WORLD_CITIES.find(c => c.city.toLowerCase() === nextCityName.toLowerCase());

  if (level === 1) {
    return `Mestre IA: Analise cuidadosamente as pistas de transporte e câmbio deixadas em ${currentCity}. Testemunhas de trânsito costumam reparar em bilhetes ou notas de dinheiro estrangeiro.`;
  }
  if (level === 2) {
    if (targetCityData) {
      return `Mestre IA: Os relatórios apontam para um país onde a moeda corrente é ${targetCityData.currency} e o idioma predominante é ${targetCityData.language}.`;
    }
    return `Mestre IA: Verifique as menções a monumentos internacionais e códigos de aeroportos nas notas de vigilância.`;
  }
  // Level 3: Almost direct hint without saying "Go to X"
  if (targetCityData) {
    return `Mestre IA: A rota de fuga leva diretamente à metrópole mundial célebre por '${targetCityData.landmark}' (${targetCityData.country}, código de voo ${targetCityData.airportCode}).`;
  }
  return `Mestre IA: Os radares da Agência mostram forte movimentação no próximo entroncamento internacional da rota.`;
}

export function getProceduralWitnessResponse(witness: Witness, question: string, evidenceShown?: any): string {
  if (evidenceShown) {
    return `${witness.evidenceReaction} O selo '${evidenceShown.title || evidenceShown.type}' corresponde exatamente ao que presenciei.`;
  }
  if (question.toLowerCase().includes('onde') || question.toLowerCase().includes('viajar') || question.toLowerCase().includes('destino')) {
    return witness.answer1;
  }
  if (question.toLowerCase().includes('aparência') || question.toLowerCase().includes('quem') || question.toLowerCase().includes('como')) {
    return witness.answer2;
  }
  return witness.statement;
}
