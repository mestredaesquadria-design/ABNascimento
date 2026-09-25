import { CaseData, DifficultyLevel, Destination, Clue, Witness, CaseDocument } from '../types/game.ts';

// Comprehensive international cities database with coordinates, landmarks, and cultural identifiers
export const WORLD_CITIES = [
  {
    city: 'Nova York',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    airportCode: 'JFK',
    lat: 40.7128,
    lng: -74.0060,
    currency: 'Dólar Americano (USD)',
    landmark: 'Estátua da Liberdade e Central Park',
    language: 'Inglês',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Famosa pela Broadway, bagels artesanais e pelo ritmo acelerado de Wall Street.',
    historicFact: 'Fundada como Nova Amsterdã em 1624, tornou-se o centro financeiro global.',
    geoInfo: 'Costa Leste dos EUA, banhada pelo Oceano Atlântico e foz do Rio Hudson.'
  },
  {
    city: 'Paris',
    country: 'França',
    flag: '🇫🇷',
    airportCode: 'CDG',
    lat: 48.8566,
    lng: 2.3522,
    currency: 'Euro (EUR)',
    landmark: 'Torre Eiffel, Museu do Louvre e Rio Sena',
    language: 'Francês',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Conhecida como a Cidade Luz, referência mundial em alta gastronomia, moda e bistrôs.',
    historicFact: 'Com mais de 2.000 anos de história, preserva o traçado neoclássico do século XIX.',
    geoInfo: 'Norte da França, cortada pelo Rio Sena no coração da Europa Ocidental.'
  },
  {
    city: 'Roma',
    country: 'Itália',
    flag: '🇮🇹',
    airportCode: 'FCO',
    lat: 41.9028,
    lng: 12.4964,
    currency: 'Euro (EUR)',
    landmark: 'Coliseu, Fórum Romano e Fontana di Trevi',
    language: 'Italiano',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Berço do Renascimento e da culinária clássica com massas frescas e gelato artesanal.',
    historicFact: 'A Cidade Eterna foi o centro do Império Romano há mais de dois milênios.',
    geoInfo: 'Península Itálica, próxima ao Mar Tirreno às margens do Rio Tibre.'
  },
  {
    city: 'Cairo',
    country: 'Egito',
    flag: '🇪🇬',
    airportCode: 'CAI',
    lat: 30.0444,
    lng: 31.2357,
    currency: 'Libra Egípcia (EGP)',
    landmark: 'Pirâmides de Gizé, a Grande Esfinge e Rio Nilo',
    language: 'Árabe',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Bazares milenares de especiarias como o Khan el-Khalili e rica tradição musical árabe.',
    historicFact: 'Uma das mais antigas civilizações do planeta, guardiã dos tesouros dos faraós.',
    geoInfo: 'Nordeste da África, delta do fértil Rio Nilo na transição para o deserto.'
  },
  {
    city: 'Tóquio',
    country: 'Japão',
    flag: '🇯🇵',
    airportCode: 'HND',
    lat: 35.6762,
    lng: 139.6503,
    currency: 'Iene Japonês (JPY)',
    landmark: 'Cruzamento de Shibuya, Templo Senso-ji e Monte Fuji ao fundo',
    language: 'Japonês',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Contraste sublime entre tecnologia futurista ultraveloz e santuários xintoístas serenos.',
    historicFact: 'Antiga vila de pescadores Edo, convertida na metrópole mais populosa do mundo.',
    geoInfo: 'Região de Kanto, costa do Oceano Pacífico no arquipélago japonês.'
  },
  {
    city: 'Rio de Janeiro',
    country: 'Brasil',
    flag: '🇧🇷',
    airportCode: 'GIG',
    lat: -22.9068,
    lng: -43.1729,
    currency: 'Real (BRL)',
    landmark: 'Cristo Redentor, Pão de Açúcar e Praia de Copacabana',
    language: 'Português',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Capital mundial do samba, da bossa nova e com calorosa hospitalidade tropical.',
    historicFact: 'Única cidade das Américas a ter sido a sede oficial de uma monarquia imperial europeia.',
    geoInfo: 'Litoral Sudeste do Brasil, entre montanhas de granito da Mata Atlântica e o Atlântico Sul.'
  },
  {
    city: 'Londres',
    country: 'Reino Unido',
    flag: '🇬🇧',
    airportCode: 'LHR',
    lat: 51.5074,
    lng: -0.1278,
    currency: 'Libra Esterlina (GBP)',
    landmark: 'Big Ben, Palácio de Westminster e Tower Bridge',
    language: 'Inglês',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Tradição do chá da tarde, pubs seculares e vanguarda global em artes e teatro.',
    historicFact: 'Fundada pelos romanos sob o nome Londinium no ano 43 d.C.',
    geoInfo: 'Sudeste da Grã-Bretanha, cortada pelo Rio Tâmisa com clima temperado marítimo.'
  },
  {
    city: 'Berlim',
    country: 'Alemanha',
    flag: '🇩🇪',
    airportCode: 'BER',
    lat: 52.5200,
    lng: 13.4050,
    currency: 'Euro (EUR)',
    landmark: 'Portão de Brandemburgo e Ilha dos Museus',
    language: 'Alemão',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Centro pulsante de criatividade underground, música eletrônica e galerias abertas.',
    historicFact: 'Marcada pela reunificação em 1989 com a célebre queda do Muro de Berlim.',
    geoInfo: 'Nordeste da Alemanha, cercada por florestas e lagos glaciais do Rio Spree.'
  },
  {
    city: 'Madri',
    country: 'Espanha',
    flag: '🇪🇸',
    airportCode: 'MAD',
    lat: 40.4168,
    lng: -3.7038,
    currency: 'Euro (EUR)',
    landmark: 'Palácio Real, Museu do Prado e Praça Maior',
    language: 'Espanhol',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Vida noturna vibrante, cultura de tapas deliciosas e espetáculos apaixonados de flamenco.',
    historicFact: 'Tornou-se a capital da monarquia espanhola em 1561 durante o Século de Ouro.',
    geoInfo: 'Planalto central da Península Ibérica, altitude de 650m no coração da Espanha.'
  },
  {
    city: 'Lisboa',
    country: 'Portugal',
    flag: '🇵🇹',
    airportCode: 'LIS',
    lat: 38.7223,
    lng: -9.1393,
    currency: 'Euro (EUR)',
    landmark: 'Torre de Belém, Mosteiro dos Jerónimos e Rio Tejo',
    language: 'Português',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Bairros históricos de calçada portuguesa, fado nostálgico e tradicionais pastéis de nata.',
    historicFact: 'Porto de partida das grandes caravelas das navegações marítimas dos séculos XV e XVI.',
    geoInfo: 'Extremo ocidental da Europa continental, estuário magnífico do Rio Tejo.'
  },
  {
    city: 'Zurique',
    country: 'Suíça',
    flag: '🇨🇭',
    airportCode: 'ZRH',
    lat: 47.3769,
    lng: 8.5417,
    currency: 'Franco Suíço (CHF)',
    landmark: 'Lago de Zurique, Igreja Fraumünster e vista dos Alpes',
    language: 'Alemão',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Capital da precisão relojoeira, bancos de custódia e chocolaterias requintadas.',
    historicFact: 'Centro da Reforma Suíça e referência histórica em neutralidade bancária e diplomática.',
    geoInfo: 'Norte dos Alpes suíços, às margens do deslumbrante Lago de Zurique.'
  },
  {
    city: 'Dubai',
    country: 'Emirados Árabes',
    flag: '🇦🇪',
    airportCode: 'DXB',
    lat: 25.2048,
    lng: 55.2708,
    currency: 'Dirham dos Emirados (AED)',
    landmark: 'Burj Khalifa, Ilhas Palm Jumeirah e Dubai Mall',
    language: 'Árabe',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Oásis cosmopolita de luxo futurista, safáris no deserto e alta tecnologia internacional.',
    historicFact: 'Transformou-se rapidamente de porto de pesca de pérolas em metrópole ultra-arrojada.',
    geoInfo: 'Península Arábica, costa do Golfo Pérsico em meio a dunas douradas.'
  },
  {
    city: 'Singapura',
    country: 'Singapura',
    flag: '🇸🇬',
    airportCode: 'SIN',
    lat: 1.3521,
    lng: 103.8198,
    currency: 'Dólar de Singapura (SGD)',
    landmark: 'Marina Bay Sands e Gardens by the Bay',
    language: 'Inglês / Malaio / Mandarim',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Cidade-jardim sustentável com rica fusão gastronômica asiática em mercados hawker.',
    historicFact: 'Estratégico entreposto marítimo do Estreito de Malaca desde o século XIX.',
    geoInfo: 'Extremo sul da Península Malaia, a apenas 137 km ao norte da linha do Equador.'
  },
  {
    city: 'Sydney',
    country: 'Austrália',
    flag: '🇦🇺',
    airportCode: 'SYD',
    lat: -33.8688,
    lng: 151.2093,
    currency: 'Dólar Australiano (AUD)',
    landmark: 'Sydney Opera House e Harbour Bridge',
    language: 'Inglês',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Estilo de vida descontraído ao ar livre, praias célebres como Bondi e gastronomia fresca.',
    historicFact: 'Primeiro assentamento europeu na Austrália, estabelecido na baía em 1788.',
    geoInfo: 'Costa Sudeste da Austrália, no Oceano Pacífico Sul com baías navegáveis icônicas.'
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    flag: '🇦🇷',
    airportCode: 'EZE',
    lat: -34.6037,
    lng: -58.3816,
    currency: 'Peso Argentino (ARS)',
    landmark: 'Obelisco da Av. 9 de Julho, Teatro Colón e Caminito',
    language: 'Espanhol',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'A Paris da América do Sul, conhecida pelos cafés históricos, livrarias e tango.',
    historicFact: 'Fundada às margens do Rio da Prata, foi a capital do Vice-Reino no século XVIII.',
    geoInfo: 'Planície dos pampas argentinos, costa oeste do estuário do Rio da Prata.'
  },
  {
    city: 'Cidade do Cabo',
    country: 'África do Sul',
    flag: '🇿🇦',
    airportCode: 'CPT',
    lat: -33.9249,
    lng: 18.4241,
    currency: 'Rand Sul-Africano (ZAR)',
    landmark: 'Table Mountain e Cabo da Boa Esperança',
    language: 'Inglês / Africâner / Xhosa',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Ponto de encontro vibrante de culturas africanas e europeias e famosa rota de vinhedos.',
    historicFact: 'Antiga rota marítima das especiarias contornando o Cabo das Tormentas em 1488.',
    geoInfo: 'Extremo sul da África, encontro das correntes dos oceanos Atlântico e Índico.'
  },
  {
    city: 'Istambul',
    country: 'Turquia',
    flag: '🇹🇷',
    airportCode: 'IST',
    lat: 41.0082,
    lng: 28.9784,
    currency: 'Lira Turca (TRY)',
    landmark: 'Estreito de Bósforo, Basílica de Santa Sofia e Grande Bazar',
    language: 'Turco',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Chá turco em copos tulipa, doces baklava e a única metrópole sobre dois continentes.',
    historicFact: 'Antiga Bizâncio e Constantinopla, capital de impérios por mais de 1.600 anos.',
    geoInfo: 'Localizada entre a Europa e a Ásia Menor, controlando o Mar de Mármara e o Mar Negro.'
  },
  {
    city: 'Seul',
    country: 'Coreia do Sul',
    flag: '🇰🇷',
    airportCode: 'ICN',
    lat: 37.5665,
    lng: 126.9780,
    currency: 'Won Sul-Coreano (KRW)',
    landmark: 'Torre N Seoul, Palácio Gyeongbokgung e Rio Han',
    language: 'Coreano',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80',
    culturalFact: 'Epicentro da onda K-Pop, gastronomia picante (kimchi/BBQ) e tecnologia móvel de ponta.',
    historicFact: 'Capital da Dinastia Joseon desde 1394, preserva muralhas e portões imperiais.',
    geoInfo: 'Bacia do Rio Han no noroeste da Península Coreana, cercada por montanhas rochosas.'
  },
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
  const flightHours = (dist / 850) + 0.6;
  return Math.max(75, Math.round(flightHours * 60));
}

// Format minutes into HH:MM display
export function formatMissionTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * SISTEMA DE PISTAS PROGRESSIVAS:
 * Nível Fácil: 3 destinos na rota (3 pistas em sequência)
 * Nível Médio: 5 destinos na rota (5 pistas em sequência)
 * Nível Difícil: 7 destinos na rota (7 pistas em sequência)
 * Cada cidade libera APENAS a sua pista única que indica o próximo destino.
 */
export function generateProceduralCase(
  difficulty: DifficultyLevel = 'medium',
  stageNumber: number = 1,
  agentNationality: string = 'Brasil'
): CaseData {
  const caseId = `AX-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const suspectTemplate = SUSPECTS_TEMPLATES[Math.floor(Math.random() * SUSPECTS_TEMPLATES.length)];
  const crimeTemplate = CRIMES_TEMPLATES[Math.floor(Math.random() * CRIMES_TEMPLATES.length)];

  // Definir número de paradas estritamente de acordo com a regra de progressão
  const destinationCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

  // Embaralhar cidades mundiais e selecionar rota única
  const shuffledCities = [...WORLD_CITIES].sort(() => Math.random() - 0.5);
  const selectedCities = shuffledCities.slice(0, destinationCount);

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

  const lastCity = selectedCities[destinationCount - 1];
  const keyEvidenceTypes = [
    { title: `Registro Criptográfico do Dispositivo ${caseId}`, type: 'electronic', description: `Log digital interceptado de conexão de rádio com a assinatura única do codinome '${suspectTemplate.codename}'.` },
    { title: `Passaporte Diplomático Adulterado de ${suspectTemplate.name}`, type: 'document', description: `Documento com carimbos falsificados exatamente na rota da fuga até ${lastCity.city}.` },
    { title: `Comprovante de Custódia e Aluguel de Hangar em ${lastCity.city}`, type: 'financial', description: `Contrato de custódia assinado à mão sob pseudônimo com a descrição do item '${crimeTemplate.stolenItemOrSecret}'.` },
  ];
  const keyEvidence = keyEvidenceTypes[Math.floor(Math.random() * keyEvidenceTypes.length)];

  const destinations: Destination[] = selectedCities.map((current, index) => {
    const nextCity = index < destinationCount - 1 ? selectedCities[index + 1] : null;
    const prevCity = index > 0 ? selectedCities[index - 1] : null;

    const travelTime = prevCity 
      ? calculateFlightDurationMinutes(prevCity.lat, prevCity.lng, current.lat, current.lng)
      : 0;

    // Witness Roles
    const witnessRoles = [
      { name: 'Marcus Silva', role: 'Gerente da Sala VIP do Aeroporto' },
      { name: 'Claire Fontaine', role: 'Recepcionista do Hotel Internacional' },
      { name: 'Tariq Hassan', role: 'Operador de Câmbio e Cybercafé' },
      { name: 'Kenji Sato', role: 'Inspetor da Linha Férrea de Alta Velocidade' },
      { name: 'Sophia Rossi', role: 'Curadora Adjunta do Museu Histórico' },
      { name: 'Alejandro Ramos', role: 'Motorista de Transporte Executivo' },
      { name: 'Nathalie Dupont', role: 'Agente Aduaneira Portuária' },
    ];
    const witnessData = witnessRoles[index % witnessRoles.length];

    // CONSTRUÇÃO DA PISTA PROGRESSIVA
    // PISTA ATUAL -> indica o próximo destino -> jogador viaja -> chegada -> próxima pista
    let progressiveClue = '';
    let witnessStatement = '';

    if (index === 0) {
      // Pista 1 (Ponto de partida / Sede da investigação)
      progressiveClue = `O suspeito cometeu o delito e foi flagrado efetuando conversão de fundos para ${nextCity?.currency}. Antes de embarcar, consultou horários de voos que sobrevoam a região de ${nextCity?.landmark} e citou o idioma ${nextCity?.language}.`;
      witnessStatement = `O indivíduo trocou moeda local por ${nextCity?.currency} e pediu informações sobre voos em direção a ${nextCity?.country}. Ele parecia ansioso para ver de perto ${nextCity?.landmark}.`;
    } else if (nextCity) {
      // Pistas intermediárias (desbloqueadas somente ao chegar na cidade correspondente)
      progressiveClue = `O suspeito esteve aqui em ${current.city}, mas deixou a cidade recentemente. Uma testemunha confirmou que ele trocou passagens rumo a um destino com ${nextCity.landmark}, mencionou costumes de ${nextCity.country} e portava notas em ${nextCity.currency}. O código aeroportuário ${nextCity.airportCode} foi rabiscado em um recibo.`;
      witnessStatement = `Reconheci o suspeito! Ele perguntou sobre o fuso horário e conexões de voo para a cidade onde fica ${nextCity.landmark}. Ele levava um guia de conversação em ${nextCity.language}.`;
    } else {
      // PISTA FINAL: Revelada somente no último destino encurralado
      progressiveClue = `🚨 ALERTA GERAL DA CENTRAL: O cerco fechou! Todas as pistas confirmam que o suspeito está escondido aqui em ${current.city}, preparando a transferência definitiva de '${crimeTemplate.stolenItemOrSecret}' próximo a ${current.landmark}. Inicie o Protocolo de Captura imediatamente!`;
      witnessStatement = `O suspeito alugou um refúgio isolado aqui mesmo em ${current.city}. Ele disse que aguardaria o comprador final nas próximas horas. A equipe tática deve agir já!`;
    }

    const clues: Clue[] = [
      {
        id: `clue-${index}-progressive`,
        type: 'witness',
        title: index === 0 
          ? `Pista 1 — Transmissão Inicial da Agência`
          : nextCity 
          ? `Pista ${index + 1} — Descoberta em ${current.city}`
          : `Pista Final — Esconderijo em ${current.city}`,
        text: progressiveClue,
        source: witnessData.role,
        hintToNextCity: Boolean(nextCity),
      }
    ];

    const doc: CaseDocument = {
      type: index === 0 ? 'police_report' : index === destinationCount - 1 ? 'bank_receipt' : 'boarding_pass',
      title: index === 0 
        ? `Boletim Confidencial de Ocorrência — ${current.city}`
        : index === destinationCount - 1
        ? `Comprovante de Custódia e Hangar — ${current.city}`
        : `Cartão de Embarque Recuperado em ${current.city}`,
      content: nextCity 
        ? `Passageiro registrado no terminal de ${current.city}. Embarque prioritário com escala apontando para ${nextCity.city} (${nextCity.country}). Moeda tarifada: ${nextCity.currency}.`
        : `Documento de recebimento da carga em ${current.city}. Pacote misterioso selado com chave quântica sob o codinome '${suspectTemplate.codename}'.`,
      issuer: `Autoridade Policial de ${current.city}`,
      date: '2026-09-24',
      serialNumber: `DOC-${current.airportCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      details: {
        Origem: current.city,
        Destino: nextCity ? nextCity.city : 'Ponto Cego Final',
        Moeda: nextCity ? nextCity.currency : current.currency,
        Status: 'Verificado',
      },
    };

    const witness: Witness = {
      name: witnessData.name,
      role: witnessData.role,
      statement: witnessStatement,
      question1: 'Você notou para onde ele pretendia viajar?',
      answer1: nextCity 
        ? `Sim! Ele consultava a taxa de câmbio de ${nextCity.currency} e mencionou que precisava pousar perto de ${nextCity.landmark}.`
        : `Ele disse que este era seu ponto de chegada final, onde entregaria a mercadoria.`,
      question2: 'Havia algo chamativo na aparência dele?',
      answer2: `Exatamente como no relatório de inteligência: ${suspectTemplate.appearance}. Falava de forma calma, porém olhava frequentemente para o relógio.`,
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
      description: `${current.city} é a capital ou metrópole de ${current.country}. ${current.landmark}.`,
      landmark: current.landmark,
      currency: current.currency,
      language: current.language,
      photoUrl: current.image,
      culturalFact: current.culturalFact,
      historicFact: current.historicFact,
      geoInfo: current.geoInfo,
      travelTimeMinutes: travelTime,
      progressiveClue: progressiveClue,
      witness,
      clues,
      document: doc,
    };
  });

  return {
    id: caseId,
    operationName,
    briefing: `O criminoso internacional ${suspectTemplate.name} ('${suspectTemplate.codename}') cometeu ${crimeTemplate.title}, subtraindo ${crimeTemplate.stolenItemOrSecret}. Siga a cadeia progressiva de pistas pelo globo até localizar o esconderijo final e executar o mandado de prisão.`,
    difficulty,
    stageNumber,
    suspect: suspectTemplate,
    crime: crimeTemplate,
    keyEvidence,
    destinations,
    status: 'active',
  };
}

export function getProceduralHint(currentCity: string, nextTargetCity: string, level: 1 | 2 | 3): string {
  const nextTarget = WORLD_CITIES.find(c => c.city.toLowerCase() === nextTargetCity.toLowerCase());
  if (!nextTarget) return 'Analise os documentos e a moeda mencionada nas pistas.';

  if (level === 1) {
    return `Orientação da Central: O suspeito procurava informações sobre a moeda '${nextTarget.currency}' e conexões para o aeroporto com a sigla '${nextTarget.airportCode}'.`;
  }
  if (level === 2) {
    return `Inteligência Tática: Fontes no solo informam que o próximo destino abriga o monumento mundialmente conhecido '${nextTarget.landmark}'.`;
  }
  return `Dica Crítica do QG: O suspeito está rumando em direção a ${nextTarget.country} (${nextTarget.flag}), no idioma ${nextTarget.language}.`;
}

export function getProceduralWitnessResponse(witness: Witness, question: string, evidenceShown?: any): string {
  const qLower = question.toLowerCase();
  if (qLower.includes('onde') || qLower.includes('destino') || qLower.includes('viagem') || qLower.includes('voo') || qLower.includes('país')) {
    return witness.answer1;
  }
  if (qLower.includes('aparência') || qLower.includes('quem') || qLower.includes('rosto') || qLower.includes('roupa') || qLower.includes('característica')) {
    return witness.answer2;
  }
  if (evidenceShown) {
    return witness.evidenceReaction;
  }
  return witness.statement;
}
