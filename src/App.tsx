/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  Bookmark, 
  X, 
  Check, 
  Download, 
  Home, 
  BookOpen, 
  Store, 
  User,
  Heart,
  Quote,
  Zap,
  Droplets,
  ClipboardCheck,
  Star
} from 'lucide-react';
import CoverScreenEspiritual from './CoverScreenEspiritual';
import DevocionalPaginasLaterais from './DevocionalPaginasLaterais';

// Image Constants from the provided HTML snippets
const IMAGES = {
  COVER_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN6VEQq5OZjgEIlzZ2BqGxYAirqa6XCNzro39KPLMaaPPSOjYM-_GHnjnZTr89KeszQhz6lPeuEVyTQG-CE7ciKMCo5DSWutBbwF3M0BIlEl3tMX9j3jI0cXAA3m06515cKgjW7Uw1ypFgp03DLQeSWbXTDuAdVNmjsXY4HCbRbdn5y72igB2SbXwWdocUPKMRjAm5WFEYoRgV2ZefrUr9v8moFeUvhV33qZj5cT5YPpg-bvjxh7Mwhyi9AqrytvepyQaekdRKz5ZN',
  VIDEO_THUMB: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfBeSbb_uG2t-GslqFwGK6-Aczt_laSWUJe1UqOafqgl_HaqAqcZL2fQUHFs_cLH5AqPmlRpqSOiAcpTbEdwBkK32vv-j_y5JgFSilkafZYQhGxC2XHgNYVbLH5ltIq5X2C27RqFnvpje_jYbG_FYIgqCl3KfY72WHSgEmfw5evBbMaUoG7Tpfo2cl_ghKmSs5R_O7pvIU0E_f1xutRAjwlDdxpQCmK1S4rIJmCfayT1krqp82oNrvz5m3TMbys9ijJJYWq-QqPM4j',
  BOOKSTORE_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmbtXhltiPI5ae6I92UHrGMjuR_fvd0zAESIzxU62wM1wqZBDXK2vl0HtkfdWeqAxWlA_ya6QejL84XBdOLxCfL-S0XTkvtY2r5aMiZacdFdQxReuGxn9Mq4jdTTNWFqkEqokhySjQZ8FgnKjDWFFEkKjP2nGM6wdV2XPTbyHHLZauAJfvBrHTrSAUsM-o9OtiR-IU8t15ygxIvZyUyH_CljLekhck3ix7aouLqXSkSgqbnBKHo4MOlo3I50dm2xrt6ilKJOM8TRQs'
};

type Screen = 'welcome' | 'sidebar' | 'lesson' | 'completion';

// Componente para anunciar mudanças de rota para screen readers
function PageAnnouncer({ currentPageTitle }: { currentPageTitle: string }) {
  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only pointer-events-none"
    >
      {`Navegou para: ${currentPageTitle}`}
    </div>
  );
}

// Componente reutilizável para botão de bookmark com estado acessível
interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

function BookmarkButton({ isBookmarked, onToggle, size = 24, className = "" }: BookmarkButtonProps) {
  return (
    <button 
      onClick={onToggle}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className={`min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark focus-visible:ring-gold ${className}`}
    >
      <Bookmark 
        size={size} 
        aria-hidden="true"
        className={isBookmarked ? "fill-gold text-gold" : "text-current"}
      />
    </button>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);

  const handleWelcomeStart = () => {
    setScreen('sidebar');
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index);
    setScreen('lesson');
  };

  const handleLessonComplete = () => {
    setScreen('completion');
  };

  const handleBackToMenu = () => {
    setScreen('sidebar');
  };

  const handleRestartFromWelcome = () => {
    setCurrentLessonIndex(0);
    setScreen('welcome');
  };

  return (
    <div className="min-h-dvh bg-spiritual-dark flex justify-center overflow-x-hidden">
      <div className="w-full max-w-md relative bg-spiritual-dark shadow-2xl min-h-dvh flex flex-col">
        <PageAnnouncer currentPageTitle={
          screen === 'welcome' ? 'Página Inicial' : 
          screen === 'sidebar' ? 'Navegação de Aulas' : 
          screen === 'lesson' ? 'Aula de Estudo' : 
          'Conclusão da Aula'
        } />
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <CoverScreenEspiritual
                onStart={handleWelcomeStart}
                onChecklist={() => setScreen('sidebar')}
                onWallpapers={() => alert('Wallpapers em desenvolvimento')}
                titulo="Além do Devocional"
                subtitulo="Aprofundamento Prático"
                descricao="Uma jornada transformadora através dos 4 Degraus da Lectio Divina"
              />
            </motion.div>
          )}
          {screen === 'sidebar' && (
            <motion.div key="sidebar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <DevocionalPaginasLaterais
                onConcluir={() => setScreen('lesson')}
              />
            </motion.div>
          )}
          {screen === 'lesson' && (
            <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <LessonScreen onFinish={handleLessonComplete} onBack={handleBackToMenu} />
            </motion.div>
          )}
          {screen === 'completion' && (
            <motion.div key="completion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <CompletionScreen onRestart={handleRestartFromWelcome} onContinue={handleBackToMenu} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CoverScreen({ onStart }: { onStart: () => void }) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  return (
    <div className="relative h-dvh flex flex-col justify-between px-6 pb-12 pt-safe overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES.COVER_BG} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 scale-110 animate-[kenburns_20s_ease-out_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-[#121008] via-[#1a160d]/80 to-transparent" />
      </div>

      {/* Top Actions */}
      <div className="relative z-10 flex justify-between items-center opacity-60">
        <button 
          aria-label="Fechar devocional"
          className="min-h-[48px] min-w-[48px] flex items-center justify-center text-white rounded-full hover:bg-white/5 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark focus-visible:ring-gold"
        >
          <X size={24} aria-hidden="true" />
        </button>
        <BookmarkButton 
          isBookmarked={isBookmarked}
          onToggle={() => setIsBookmarked(!isBookmarked)}
          className="text-white hover:bg-white/5 hover:opacity-100"
        />
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center justify-center flex-grow -mt-10 space-y-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-4 bg-black/20 backdrop-blur-sm"
        >
          <BookOpen className="text-gold" size={20} />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-5xl text-gold font-bold leading-tight text-glow tracking-tight"
        >
          Além do<br/>
          <span className="italic font-medium text-white/90">Devocional</span>
        </motion.h1>

        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 w-full justify-center opacity-60"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
          <Star className="text-gold fill-gold" size={10} />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
        </motion.div>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs font-sans uppercase tracking-[0.25em] text-slate-300 font-semibold"
        >
          Aprofundamento Prático
        </motion.p>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 w-full flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Play className="text-gold fill-gold" size={12} />
            <span className="text-[10px] font-medium text-slate-200 tracking-wide uppercase">Aula 01 • 45 min</span>
          </div>
        </div>

        <button 
          onClick={onStart}
          aria-label="Iniciar aula de aprofundamento prático"
          className="group relative w-full overflow-hidden rounded-xl glass-panel p-1 transition-all duration-300 hover:bg-gold/10 active:scale-[0.98]"
        >
          <div className="relative flex items-center justify-between rounded-lg px-6 py-4 bg-gradient-to-r from-gold/10 to-transparent group-hover:from-gold/20 transition-all">
            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-bold text-white tracking-wide group-hover:text-gold transition-colors">Iniciar Aula</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Toque para começar</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center shadow-[0_0_15px_rgba(207,170,108,0.4)] group-hover:shadow-[0_0_25px_rgba(207,170,108,0.6)] transition-all">
              <ArrowRight className="text-spiritual-dark font-bold" size={20} aria-hidden="true" />
            </div>
          </div>
        </button>

        <button aria-label="Ver detalhes do curso" className="text-[10px] text-slate-500 hover:text-gold transition-colors tracking-widest uppercase font-semibold">
          Ver Detalhes do Curso
        </button>
      </div>
    </div>
  );
}

function LessonScreen({ onFinish, onBack }: { onFinish: () => void, onBack: () => void }) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  return (
    <div className="flex flex-col h-dvh bg-spiritual-charcoal">

      {/* Video Header */}
      <div className="relative w-full aspect-video bg-black shadow-lg z-40">
        <img 
          src={IMAGES.VIDEO_THUMB} 
          alt="Video Thumbnail" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            aria-label="Reproduzir vídeo da aula"
            className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold cursor-pointer hover:bg-gold/30 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Play className="text-white fill-white ml-1" size={28} aria-hidden="true" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div className="h-full w-1/3 bg-gold"></div>
        </div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
          <button 
            onClick={onBack} 
            aria-label="Voltar para tela anterior"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center bg-black/20 rounded-full backdrop-blur-md border border-white/10 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase opacity-80">Guia de Estudo</span>
          <BookmarkButton 
            isBookmarked={isBookmarked}
            onToggle={() => setIsBookmarked(!isBookmarked)}
            size={16}
            className="bg-black/20 rounded-full backdrop-blur-md border border-white/10 text-white"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scroll-hide px-6 pt-8 pb-32 space-y-10">
        <header className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2 pr-4 relative z-10">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Módulo 2</p>
              <h1 className="text-3xl font-bold leading-tight text-white font-serif">
                Os 4 Degraus <br/>
                <span className="text-lg font-normal italic text-gold-light block mt-1">O Método da Lectio Divina</span>
              </h1>
            </div>
            <div className="absolute right-0 top-0 -mt-6 opacity-10 pointer-events-none">
              <span className="text-[120px] leading-none font-serif text-gold font-bold">4</span>
            </div>
          </div>
          <div className="mt-6 text-base md:text-lg leading-relaxed text-slate-100 border-l-2 border-gold pl-4 italic">
            "A Palavra de Deus é viva e eficaz." 
            <span className="text-sm not-italic text-slate-400 block mt-2">— Hebreus 4:12</span>
          </div>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-200 font-light">
            Ler um livro é buscar informação; ler a Bíblia é escutar uma Pessoa. Siga a escada milenar de 4 passos para aprofundar sua vida de oração.
          </p>
        </header>

        {/* Steps */}
        <div className="space-y-4">
          {[
            { id: 'I', title: 'Leitura', text: 'O que o texto diz? Leia devagar, identifique o cenário e os personagens. Não tenha pressa, absorva os detalhes.' },
            { id: 'II', title: 'Meditação', text: 'O que o texto diz para mim hoje? Saboreie as palavras. Onde aquela passagem se encaixa na sua dor atual?' },
            { id: 'III', title: 'Oração', text: 'O que eu respondo a Deus? Transforme o que você meditou em louvor, pedido de perdão ou súplica sincera.' },
            { id: 'IV', title: 'Contemplação', text: 'Ficar em paz. Repouse no silêncio de saber que Deus te acolhe, sem precisar dizer mais nada. Apenas esteja presente.' },
          ].map((step) => (
            <div key={step.id} className="bg-gradient-to-br from-[#262626] to-[#1f1f1f] border border-gold/10 rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-full -mr-4 -mt-4" />
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-gold text-lg font-bold font-serif">{step.id}.</span>
                <h3 className="text-xl text-slate-100 font-serif font-semibold">{step.title}</h3>
              </div>
              <p className="text-base md:text-lg text-slate-200 leading-relaxed font-light">
                <span className="block mb-2 p-3 bg-gold/5 border-l-2 border-gold text-amber-100 italic rounded-r-lg">
                  {step.text.split('? ')[0]}?
                </span>
                {step.text.split('? ')[1] || step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Crisis Management */}
        <div className="pt-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-px bg-gray-800 flex-grow" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Gestão de Crises</h2>
            <div className="h-px bg-gray-800 flex-grow" />
          </div>

          <div className="space-y-8">
            <CrisisItem 
              icon={<Zap size={18} />} 
              title="A Dor da Distração Severa" 
              text="Você silencia o quarto e a sua mente começa a gritar listando boletos, brigas de família e preocupações. Não sinta culpa. Não tente bloquear as distrações lutando contra elas. Se a distração for sobre uma dívida, transforme isso na pauta da oração: 'Senhor, entrego o medo dessa dívida a Ti agora'."
              quote="A distração perde a força quando vira oração."
            />
            <CrisisItem 
              icon={<Droplets size={18} />} 
              title="A Dor da Aridez (Não sentir nada)" 
              text="Muitas vezes entramos na Quaresma esperando sentir grandes emoções. Quando rezamos e não sentimos nada (nem choro, nem arrepios), achamos que Deus nos abandonou. Errado. Teologicamente, a aridez é a fase mais madura da fé. É quando Deus retira os 'sentimentos bons' para ver se você busca o 'Deus das consolações' ou apenas as 'consolações de Deus'."
              quote="Perseverar no dia seco e sem vontade forja um caráter de diamante."
            />
            <CrisisItem 
              icon={<ClipboardCheck size={18} />} 
              title="O Fim do Checklist" 
              text="A vida cristã é relação, não contabilidade. Se chegou a sexta-feira e você não cumpriu as leituras e nem a regra, apenas diga: 'Senhor, sou frágil e falhei, mas volto a Ti agora'."
              quote="O seu destino não é uma planilha perfeita e ticada; o seu destino é o coração clemente de Cristo."
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <button 
          onClick={onFinish}
          aria-label="Concluir estudo da aula"
          className="w-full py-4 rounded-xl bg-gold text-spiritual-dark font-bold uppercase tracking-widest text-xs shadow-[0_4px_20px_rgba(207,170,108,0.3)] hover:bg-gold-light transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-charcoal focus-visible:ring-gold"
        >
          Concluir Estudo
        </button>
      </div>
    </div>
  );
}

function CrisisItem({ icon, title, text, quote }: { icon: React.ReactNode, title: string, text: string, quote?: string }) {
  return (
    <div className="pl-4 border-l border-gray-800 space-y-2">
      <h4 className="text-slate-100 font-semibold flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        {title}
      </h4>
      <p className="text-base md:text-lg text-slate-200 leading-relaxed font-light">
        {text}
      </p>
      {quote && (
        <div className="mt-3 p-4 bg-white/5 border-l-2 border-gold rounded-r-lg relative overflow-hidden group">
          <Quote className="absolute -top-1 -right-1 text-gold/10 rotate-12" size={48} aria-hidden="true" />
          <p className="text-amber-100 italic text-base md:text-lg font-light relative z-10 leading-relaxed">
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}

function CompletionScreen({ onRestart, onContinue }: { onRestart: () => void, onContinue?: () => void }) {
  return (
    <div className="flex flex-col h-dvh bg-spiritual-dark relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-gold/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <header className="flex justify-end p-6 pt-12 relative z-10">
        <button 
          onClick={onRestart} 
          aria-label="Fechar e voltar ao início"
          className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto scroll-hide pb-32 relative z-10">
        <section className="px-6 pt-4 pb-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="mb-8 relative"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shadow-[0_0_15px_rgba(207,170,108,0.2)]">
              <Check className="text-gold" size={32} />
            </div>
          </motion.div>
          
          <span className="text-gold/80 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Aula Concluída</span>
          
          <h1 className="font-serif text-4xl text-white font-medium italic leading-tight mb-4 text-glow">
            Obrigado por <br/> <span className="text-gold not-italic">ir além</span>
          </h1>
          
          <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-xs font-light mx-auto">
            Sua jornada de aprofundamento continua. O conhecimento é apenas o começo da transformação.
          </p>
        </section>

        <section className="px-6 space-y-6">
          {/* Download Card */}
          <div 
            onClick={() => {
              const text = `Guia de Estudo: Além do Devocional\n\nAlém do Devocional: Aprofundamento Prático\n\nEste guia existe para te arrancar da "leitura passiva" e do perigo da espiritualidade moderna: o perfeccionismo que te trata como uma máquina de produtividade e não como um filho amado.\n\nOs 4 Degraus (O Método da Lectio Divina)\n\nA Palavra de Deus é viva e eficaz (Hebreus 4:12). Ler um livro é buscar informação; ler a Bíblia é escutar uma Pessoa. Siga a escada milenar de 4 passos:\n\n1. Leitura: O que o texto diz? Leia devagar, identifique o cenário e os personagens.\n2. Meditação: O que o texto diz para mim hoje? Saboreie as palavras. Onde aquela passagem se encaixa na sua dor atual?\n3. Oração: O que eu respondo a Deus? Transforme o que você meditou em louvor, pedido de perdão ou súplica.\n4. Contemplação: Ficar em paz. Repouse no silêncio de saber que Deus te acolhe, sem precisar dizer mais nada.\n\nGestão de Crises Espirituais:\n\n- A Dor da Distração Severa: Você silencia o quarto e a sua mente começa a gritar listando boletos, brigas de família e preocupações. Não sinta culpa. Não tente bloquear as distrações lutando contra elas. Se a distração for sobre uma dívida, transforme isso na pauta da oração: "Senhor, entrego o medo dessa dívida a Ti agora". A distração perde a força quando vira oração.\n- A Dor da Aridez (Não sentir nada): Muitas vezes entramos na Quaresma esperando sentir grandes emoções. Quando rezamos e não sentimos nada (nem choro, nem arrepios), achamos que Deus nos abandonou. Errado. Teologicamente, a aridez é a fase mais madura da fé. É quando Deus retira os "sentimentos bons" para ver se você busca o "Deus das consolações" ou apenas as "consolações de Deus". Perseverar no dia seco e sem vontade forja um caráter de diamante.\n- O Fim do Checklist: A vida cristã é relação, não contabilidade. Se chegou a sexta-feira e você não cumpriu as leituras e nem a regra, apenas diga: "Senhor, sou frágil e falhei, mas volto a Ti agora". O seu destino não é uma planilha perfeita e ticada; o seu destino é o coração clemente de Cristo.`;
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Guia_Alem_do_Devocional.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.currentTarget.click();
              }
            }}
            aria-label="Baixar guia de estudo em formato texto"
            className="glass-panel rounded-2xl p-6 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-white font-semibold text-lg font-serif">Guia de Estudo</h3>
              <p className="text-gold text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                Disponível para Baixar
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gold text-spiritual-dark flex items-center justify-center shadow-lg group-hover:bg-gold-light transition-colors">
              <Download size={20} aria-hidden="true" />
            </div>
          </div>

          {/* Bookstore Card */}
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group shadow-2xl">
            <img 
              src={IMAGES.BOOKSTORE_BG} 
              alt="Bookstore" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10">
              <div className="mb-6">
                <span className="bg-gold/20 text-gold border border-gold/30 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                  Recomendado
                </span>
                <h2 className="text-3xl font-serif text-white italic mb-2">Explore nossa Livraria</h2>
                <p className="text-slate-200 text-base leading-relaxed line-clamp-2 font-light">
                  Descubra obras selecionadas para aprofundar sua fé e conhecimento teológico.
                </p>
              </div>
              
              <button className="w-full bg-gold hover:bg-gold-light text-spiritual-dark font-bold text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark focus-visible:ring-gold" aria-label="Explorar livraria de obras teológicas selecionadas">
                <span>Ver Coleção</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Next Lesson Button */}
          {onContinue && (
            <button
              onClick={onContinue}
              className="glass-panel rounded-2xl p-6 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark"
              aria-label="Ir para próxima aula"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-white font-semibold text-lg font-serif">Próxima Aula</h3>
                <p className="text-gold text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Continue Sua Jornada
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold text-spiritual-dark flex items-center justify-center shadow-lg group-hover:bg-gold-light transition-colors">
                <ArrowRight size={20} aria-hidden="true" />
              </div>
            </button>
          )}
        </section>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pb-safe">
        <div className="absolute inset-0 bg-spiritual-dark/90 backdrop-blur-xl border-t border-white/5" />
        <div className="relative flex justify-between items-center px-12 pb-8 pt-4">
          <NavItem icon={<Home size={22} />} label="Início" onClick={onRestart} />
          <NavItem icon={<BookOpen size={22} />} label="Estudos" active onClick={() => {}} />
          <NavItem icon={<Store size={22} />} label="Livraria" onClick={() => alert('Livraria em breve!')} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-col items-center justify-center gap-1.5 transition-colors min-h-[48px] min-w-[12rem] py-2 focus-visible:ring-2 focus-visible:ring-gold rounded ${active ? 'text-gold' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <div className="relative">
        {icon}
        {active && <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_rgba(207,170,108,0.8)]" aria-hidden="true" />}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
