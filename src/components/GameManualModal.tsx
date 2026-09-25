import React, { useState } from 'react';
import { BookOpen, X, Shield, Globe, Search, Clock, Target, Award, Users, HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, Sparkles, Compass } from 'lucide-react';
import { audioEngine } from '../services/audioService.ts';

interface GameManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ManualSection = 'overview' | 'investigation' | 'travel' | 'capture' | 'ranks' | 'difficulties' | 'multiplayer' | 'tips';

export const GameManualModal: React.FC<GameManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<ManualSection>('overview');

  if (!isOpen) return null;

  const sections: { id: ManualSection; label: string; icon: any }[] = [
    { id: 'overview', label: '1. Visão Geral', icon: Shield },
    { id: 'investigation', label: '2. Investigação & Pistas', icon: Search },
    { id: 'travel', label: '3. Viagens & Tempo', icon: Compass },
    { id: 'capture', label: '4. Captura em 20 Minutos', icon: Target },
    { id: 'difficulties', label: '5. Dificuldades & Campanha', icon: AlertTriangle },
    { id: 'ranks', label: '6. Patentes & Carreira', icon: Award },
    { id: 'multiplayer', label: '7. Modos Multijogador', icon: Users },
    { id: 'tips', label: '8. Dicas Táticas do QG', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-cyan-800/60 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-cyan-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                  Documento Oficial da Agência
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Nível: Acesso Restrito</span>
              </div>
              <h3 className="font-mono font-black text-lg text-slate-100 uppercase tracking-wider">
                Manual de Operações de Campo — Agente X
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar Navigation + Content Viewer */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1.5 shrink-0">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveSection(sec.id);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono text-xs text-left transition-all whitespace-nowrap md:whitespace-normal shrink-0 md:shrink ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-950/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{sec.label}</span>
                  {isActive && <ChevronRight className="hidden md:block w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Main Manual Content */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto font-mono text-sm leading-relaxed text-slate-200 space-y-6">
            
            {/* 1. VISÃO GERAL */}
            {activeSection === 'overview' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    1. Visão Geral & O Conceito do Jogo
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Bem-vindo à maior agência internacional de inteligência e perseguição tática.
                  </p>
                </div>

                <p>
                  Você assume a identidade do <strong>AGENTE X</strong>, um investigador de elite que começa como recruta e evolui profissionalmente conforme resolve mistérios e desmantela planos criminosos por todo o planeta.
                </p>

                <div className="p-4 bg-slate-950 border border-cyan-900/40 rounded-xl space-y-2">
                  <div className="text-cyan-400 font-bold uppercase text-xs">Objetivo de Cada Missão:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    <li>Descobrir quem é o <strong>suspeito internacional</strong> responsável pelo crime;</li>
                    <li>Rastrear por onde ele está fugindo seguindo o rastro de pistas;</li>
                    <li>Identificar qual será seu <strong>próximo destino</strong> em cada uma das 6 cidades;</li>
                    <li>Localizar o esconderijo final e comprovar o crime com a <strong>evidência chave</strong>;</li>
                    <li>Autorizar a captura antes que o tempo limite de <strong>20 minutos</strong> se esgote!</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-400">
                  ⚠️ <em>O suspeito estará sempre em movimento. A cada pista recolhida, novos elementos geográficos, moedas, idiomas e conexões aéreas surgirão para orientar seu próximo voo.</em>
                </p>
              </div>
            )}

            {/* 2. INVESTIGAÇÃO & PISTAS */}
            {activeSection === 'investigation' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-5 h-5 text-cyan-400" />
                    2. Coleta de Pistas & Interrogatórios
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Como extrair a verdade através de testemunhas, registros e inteligência.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-cyan-300 block text-sm">👤 Interrogatório de Testemunhas</span>
                    <p className="text-slate-400">
                      Entreviste recepcionistas de hotéis, pilotos, agentes alfandegários e comerciantes locais. Faça perguntas direcionadas ou envie perguntas livres com a IA integrada.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-amber-300 block text-sm">📄 Dossiê de Documentos</span>
                    <p className="text-slate-400">
                      Inspecione passaportes confiscados, bilhetes aéreos com conexões e aeroportos, comprovantes bancários com taxas de câmbio e memorandos secretos cifrados.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-purple-300 block text-sm">🧩 Enigma de Descriptografia</span>
                    <p className="text-slate-400">
                      Mensagens cifradas por Cifra de César podem ser decifradas com a ferramenta de quebra de códigos no Dossiê, revelando nomes de países e pontos de encontro.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-300 block text-sm">🤖 Mestre IA (Orientador)</span>
                    <p className="text-slate-400">
                      Consulte seu assistente de inteligência artificial. Ele analisa seu caso e fornece orientações lógicas e dicas investigativas sem estragar a dedução final.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                  💡 <strong>Atenção Investigativa:</strong> Algumas pistas revelam a próxima cidade da rota (moeda local, fuso horário, monumento famoso), enquanto outras fornecem traços físicos ou hábitos do suspeito (profissões, sotaque, cor de cabelo).
                </div>
              </div>
            )}

            {/* 3. VIAGENS & TEMPO */}
            {activeSection === 'travel' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-5 h-5 text-cyan-400" />
                    3. Sistema de Viagem & Gestão de Tempo
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    A física do globo terrestre calculada em tempo real de missão.
                  </p>
                </div>

                <p>
                  Ao deduzir para onde o suspeito fugiu, acesse a aba <strong>Mapa Tático</strong> e selecione a cidade de destino.
                </p>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100">Cálculo de Distância Real:</strong> As durações de voo são calculadas com precisão esférica baseada na latitude e longitude real das capitais mundiais.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100">Tempo de Missão:</strong> O tempo gasto não exige esperar horas no relógio da vida real. O jogo contabiliza o <em>Tempo de Missão Fictício</em> (viagens aéreas + investigações em solo).
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Penalidade por Destino Incorreto:</strong> Se você viajar para uma cidade onde o suspeito não passou, a equipe não encontrará pistas e seu agente perderá o dobro do tempo de voo (ida e retorno obrigatório)!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CAPTURA EM 20 MINUTOS */}
            {activeSection === 'capture' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    4. Protocolo de Captura em 20 Minutos
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    A fase de perseguição máxima após encurralar o criminoso.
                  </p>
                </div>

                <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-200">
                  🚨 Quando você atinge o 6º e último destino do caso, ou aciona a autorização de cerco, inicia-se a contagem regressiva crítica: <strong>20 MINUTOS PARA A CAPTURA</strong>.
                </div>

                <p>
                  Para emitir a ordem de cerco sem desencadear um incidente diplomático internacional, a Agência exige validação irrefutável de três perguntas:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
                  <li><strong>Identidade do Suspeito:</strong> Selecione qual dos suspeitos investigados corresponde às características das testemunhas;</li>
                  <li><strong>Localização Final:</strong> Aponte a cidade exata em que o suspeito está tentando se refugiar;</li>
                  <li><strong>Evidência Chave:</strong> Selecione o objeto, documento ou prova material que fundamenta a prisão legal.</li>
                </ol>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="text-amber-400 font-bold">Consequência de Erro no Mandado:</div>
                  <p className="text-slate-400">
                    Se você acusar o suspeito errado ou a localização errada, a Central rejeitará a ordem e você perderá 5 minutos do cronômetro de cerco! Se o cronômetro chegar a <strong>00:00</strong>, o suspeito escapará e o caso será <strong>ARQUIVADO COMO CASO PERDIDO</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* 5. DIFICULDADES & CAMPANHA */}
            {activeSection === 'difficulties' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-cyan-400" />
                    5. Níveis de Dificuldade & As 30 Etapas
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Sistema escalonado de complexidade investigativa.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                    <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                      <span>🟢 Nível Fácil (Etapas 1 a 10)</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      <strong>3 pistas principais por etapa.</strong> Pistas claras e diretas para ensinar a lógica da dedução internacional e ambientar o agente no sistema da Agência.
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl">
                    <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <span>🟡 Nível Médio (Etapas 11 a 20)</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      <strong>5 pistas principais por etapa.</strong> Pistas que exigem comparação cultural, identificação de moedas, pistas incompletas e rotas com conexões secundárias.
                    </p>
                  </div>

                  <div className="p-3.5 bg-red-950/30 border border-red-800/40 rounded-xl">
                    <div className="font-bold text-red-400 text-sm flex items-center gap-2">
                      <span>🔴 Nível Difícil (Etapas 21 a 30)</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      <strong>7 pistas principais por etapa.</strong> Enigmas profundos, documentos cifrados, contradições propositais entre informantes e gestão milimétrica do tempo de voo.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-300">
                  ⭐ <strong>Modo Mestre:</strong> Casos gerados dinamicamente com IA avançada contendo cenários únicos de espionagem, crimes de alta tecnologia e conexões diplomáticas.
                </div>
              </div>
            )}

            {/* 6. PATENTES & CARREIRA */}
            {activeSection === 'ranks' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    6. Patentes, XP & Progressão de Carreira
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Evolução meritocrática por resolução e precisão.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-200">🥉 Recruta</span>
                    <span className="text-slate-400">Início de carreira no QG</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-cyan-300">🕵️ Agente Júnior</span>
                    <span className="text-slate-400">2 casos solucionados</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-cyan-400">🔎 Investigador</span>
                    <span className="text-slate-400">5 casos solucionados</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-blue-400">🎖️ Agente Especial</span>
                    <span className="text-slate-400">10 casos solucionados</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-purple-400">🏅 Agente Sênior</span>
                    <span className="text-slate-400">15 casos (mínimo 3 difíceis)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400">⭐ Agente Elite</span>
                    <span className="text-slate-400">22 casos (mínimo 5 difíceis)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-amber-950/40 rounded-lg border border-amber-600/50">
                    <span className="font-bold text-amber-300">👑 Mestre Investigador</span>
                    <span className="text-amber-300 font-bold">30 casos (8 difíceis + 80% precisão)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  As promoções concedem acesso a novas regiões internacionais, recursos estratégicos e elevam sua posição no Ranking Mundial.
                </p>
              </div>
            )}

            {/* 7. MULTIJOGADOR */}
            {activeSection === 'multiplayer' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    7. Modos Multijogador Internacionais
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Jogue com outros agentes ao redor do mundo.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-cyan-300 text-sm">⚔️ Duelo 1 vs 1</div>
                    <p className="text-slate-400">
                      Dois agentes recebem exatamente o mesmo caso e concorrem simultaneamente. Vence quem emitir a ordem correta de captura com o menor tempo total e a maior precisão de voos.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-emerald-300 text-sm">🤝 Missão Cooperativa (Equipe de 4)</div>
                    <p className="text-slate-400">
                      Quatro agentes assumem funções táticas complementares: <strong>Investigador de Solo</strong>, <strong>Rastreador Aéreo</strong>, <strong>Analista de Dados</strong> e <strong>Interrogador Principal</strong>. O sucesso exige coordenação total do esquadrão.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-amber-300 text-sm">🌎 Desafio Global Diário</div>
                    <p className="text-slate-400">
                      Um caso oficial disponibilizado diariamente pela Agência para todos os agentes do mundo, com ranking exclusivo de 24 horas e pontuação bônus para o Hall da Fama.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. DICAS TÁTICAS */}
            {activeSection === 'tips' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    8. Dicas Táticas da Agência
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Conselhos de sobrevivência e eficiência investigativa.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">1. Não viaje no impulso:</strong>
                    Antes de embarcar em um voo internacional, certifique-se de que ao menos duas pistas apontam para o mesmo país ou continente (moeda, bandeira, monumento).
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">2. Inspecione os documentos com atenção:</strong>
                    Bilhetes aéreos no Dossiê revelam códigos de aeroportos (como CDG, HND, GIG, JFK) que entregam a rota exata de fuga do suspeito.
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">3. Use o botão de ajuste de fonte:</strong>
                    Caso queira aumentar o tamanho do texto dos dossiês e relatórios, clique a qualquer momento no botão <strong>A+ Fonte</strong> na barra superior para alternar entre Normal, Grande e Máxima!
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">4. Consulte o Mestre IA:</strong>
                    Quando tiver dúvidas sobre a interpretação de uma pista, abra a aba Mestre IA dentro da sala de investigação e peça um resumo tático do caso.
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 font-mono text-xs text-slate-400">
          <span>Agente X — Central de Operações Mundiais</span>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Entendido, Fechar Manual
          </button>
        </div>

      </div>
    </div>
  );
};
