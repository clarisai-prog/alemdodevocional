import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

interface Pagina {
  id: number;
  titulo: string;
  sub: string;
  conteudo: string;
  videoUrl?: string;
}

interface DevocionalPaginasLateraisProps {
  onConcluir?: () => void;
  paginas?: Pagina[];
}

export default function DevocionalPaginasLaterais({ 
  onConcluir,
  paginas: paginasCustomizadas
}: DevocionalPaginasLateraisProps) {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageAnnouncerRef = useRef<HTMLDivElement>(null);

  // Páginas padrão - usando caminho correto com base URL
  const baseUrl = import.meta.env.BASE_URL || '/alemdodevocional/';
  
  const paginasDefault: Pagina[] = [
    { 
      id: 1, 
      titulo: "Prudência e Justiça", 
      sub: "A Ordem da Vida",
      conteudo: "Este guia existe para te arrancar da 'leitura passiva' e do perigo da espiritualidade moderna: o perfeccionismo que te trata como uma máquina de produtividade e não como um filho amado.",
      videoUrl: `${baseUrl}videos/video-1.mp4`
    },
    { 
      id: 2, 
      titulo: "Fortaleza", 
      sub: "A Ciência de Levantar",
      conteudo: "A Palavra de Deus é viva e eficaz. Ler um livro é buscar informação; ler a Bíblia é escutar uma Pessoa. Siga a escada milenar de 4 passos para aprofundar sua vida de oração.",
      videoUrl: `${baseUrl}videos/video-2.mp4`
    },
    { 
      id: 3, 
      titulo: "Temperança", 
      sub: "O Domínio do Conforto",
      conteudo: "Ficar em paz. Repouse no silêncio de saber que Deus te acolhe, sem precisar dizer mais nada. Apenas esteja presente.",
      videoUrl: `${baseUrl}videos/video-3.mp4`
    }
  ];

  const paginas = paginasCustomizadas || paginasDefault;
  const paginaAtualData = paginas[paginaAtual];

  // A11y: Gerencia o foco para leitores de tela quando a página muda
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [paginaAtual]);

  // Keyboard navigation (setas do teclado)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        irParaProxima();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        irParaAnterior();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginaAtual, paginas.length]);

  const irParaProxima = () => {
    setPaginaAtual((prev) => {
      const novaP = Math.min(prev + 1, paginas.length - 1);
      return novaP;
    });
  };

  const irParaAnterior = () => {
    setPaginaAtual((prev) => {
      const novaP = Math.max(prev - 1, 0);
      return novaP;
    });
  };

  const handleConcluir = () => {
    if (onConcluir) {
      onConcluir();
    }
  };

  return (
    <div className="h-screen w-full bg-spiritual-dark text-gray-200 flex flex-col overflow-hidden relative">
      
      {/* Screen reader announcer */}
      <div 
        ref={pageAnnouncerRef}
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {`Página ${paginaAtual + 1} de ${paginas.length}: ${paginaAtualData.titulo}`}
      </div>

      {/* 📊 BARRA DE PROGRESSO SUPERIOR */}
      <div 
        className="absolute top-0 left-0 w-full z-40 flex gap-2 px-4 py-3 bg-gradient-to-b from-spiritual-dark/90 to-transparent pointer-events-none"
        role="progressbar"
        aria-valuenow={paginaAtual + 1}
        aria-valuemin={1}
        aria-valuemax={paginas.length}
        aria-label="Progresso da aula"
      >
        {paginas.map((_, index) => (
          <div 
            key={index} 
            className="h-1 flex-1 rounded-full bg-slate-700 overflow-hidden"
            aria-hidden="true"
          >
            <div 
              className={`h-full bg-gold transition-all duration-700 ease-out ${index <= paginaAtual ? 'w-full' : 'w-0'}`}
            />
          </div>
        ))}
      </div>

      {/* 🔀 CONTAINER DE NAVEGAÇÃO LATERAL */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${paginaAtual * 100}%)` }}
      >
        {paginas.map((pagina, index) => (
          
          /* 📄 CADA PÁGINA INDIVIDUAL */
          <main 
            key={pagina.id} 
            className="min-w-full w-full h-full overflow-y-auto pb-32 pt-16 scroll-hide flex-shrink-0"
            tabIndex={-1}
            ref={index === paginaAtual ? containerRef : null}
            aria-hidden={index !== paginaAtual}
            role="region"
            aria-label={`Página de ${pagina.titulo}`}
          >
            {/* 🎬 Player de Vídeo Real */}
            {pagina.videoUrl && (
              <video
                key={`video-${pagina.id}`}
                controls
                preload="metadata"
                className="w-full aspect-video bg-black rounded-2xl shadow-xl mx-auto max-w-2xl mb-6"
                aria-label={`Vídeo: ${pagina.titulo}`}
              >
                <source src={pagina.videoUrl} type="video/mp4" />
                Seu navegador não suporta vídeos HTML5
              </video>
            )}
            {!pagina.videoUrl && (
              <div className="w-full aspect-video bg-gradient-to-br from-gold/20 to-slate-800 relative flex items-center justify-center mb-6 shadow-xl rounded-2xl mx-auto max-w-2xl">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={`${isPlaying ? 'Pausar' : 'Reproduzir'} vídeo: ${pagina.titulo}`}
                  aria-pressed={isPlaying}
                  className="min-h-[56px] min-w-[56px] bg-gold hover:bg-gold-light text-spiritual-dark rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark focus-visible:ring-gold"
                >
                  <Play 
                    size={24} 
                    className="fill-current ml-1" 
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}

            {/* 📖 Textos da Página */}
            <article className="px-6 max-w-2xl mx-auto">
              <header className="mb-6">
                <p className="text-[10px] tracking-[0.2em] text-gold uppercase font-semibold mb-2">
                  Vídeo {pagina.id} de {paginas.length}
                </p>
                <h1 className="text-4xl font-serif text-slate-100 mb-2">{pagina.titulo}</h1>
                <p className="italic text-slate-300 text-base">{pagina.sub}</p>
              </header>

              <hr className="border-slate-700 mb-6" />

              <div className="space-y-6 text-base md:text-lg leading-relaxed text-slate-200">
                <p>{pagina.conteudo}</p>
                
                <section>
                  <h2 className="text-2xl font-serif text-gold mt-8 mb-4">Os 4 Degraus (Lectio Divina)</h2>
                  <ol className="space-y-4 list-decimal list-inside">
                    <li>
                      <strong className="text-slate-100">Leitura:</strong> O que o texto diz? Leia devagar, identifique o cenário e os personagens.
                    </li>
                    <li>
                      <strong className="text-slate-100">Meditação:</strong> O que o texto diz para mim hoje? Saboreie as palavras.
                    </li>
                    <li>
                      <strong className="text-slate-100">Oração:</strong> O que eu respondo a Deus? Transforme em louvor ou pedido.
                    </li>
                    <li>
                      <strong className="text-slate-100">Contemplação:</strong> Ficar em paz. Repouse no silêncio.
                    </li>
                  </ol>
                </section>
              </div>
            </article>
          </main>
        ))}
      </div>

      {/* 🧭 CONTROLES INFERIORES FIXOS */}
      <footer 
        className="fixed bottom-0 left-0 right-0 bg-spiritual-dark/95 backdrop-blur-md border-t border-slate-700 p-4 flex justify-between items-center z-50 gap-4"
        role="navigation"
        aria-label="Navegação da aula"
      >
        <button 
          onClick={irParaAnterior}
          disabled={paginaAtual === 0}
          aria-label="Voltar para página anterior"
          className="min-h-[48px] min-w-[120px] px-6 py-3 text-sm font-medium text-gold disabled:opacity-40 disabled:cursor-not-allowed hover:text-gold-light transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-gold flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>

        <span 
          className="text-xs text-slate-400 font-medium"
          aria-hidden="true"
        >
          {paginaAtual + 1} / {paginas.length}
        </span>

        <button 
          onClick={paginaAtual === paginas.length - 1 ? handleConcluir : irParaProxima}
          aria-label={paginaAtual === paginas.length - 1 ? "Concluir aula" : "Ir para próxima página"}
          className="min-h-[48px] min-w-[140px] px-8 py-3 bg-gold hover:bg-gold-light text-spiritual-dark text-sm font-bold rounded-full disabled:opacity-40 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-spiritual-dark focus-visible:ring-gold flex items-center justify-center gap-2 shadow-lg"
        >
          {paginaAtual === paginas.length - 1 ? 'Concluir' : 'Próximo'}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </footer>

      {/* Hint para keyboard users */}
      <div className="sr-only">
        Use as setas do teclado para navegar entre páginas.
      </div>
    </div>
  );
}
