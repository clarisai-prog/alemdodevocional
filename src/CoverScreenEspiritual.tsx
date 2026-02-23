import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CoverScreenEspiritualProps {
  onStart: () => void;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
}

export default function CoverScreenEspiritual({
  onStart,
  titulo = "Ambiente Espiritual",
  subtitulo = "Arrume a Casa para Deus Entrar",
  descricao = "Um programa prático de 5 etapas para transformar seu espaço e sua rotina em um santuário de oração."
}: CoverScreenEspiritualProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative h-dvh w-full overflow-hidden flex flex-col justify-center items-center px-6 py-12">
      
      {/* 🖼️ Imagem de Capa Inicial */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/alemdodevocional/capa-inicial.png" 
          alt="Capa Além do Devocional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a160d]/80 via-[#1a160d]/60 to-[#1a160d]/90"></div>
      </div>

      {/* 🌟 Efeito de Partículas Estreladas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Bokeh grande ao fundo */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* 📍 Conteúdo Principal */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* ✨ Símbolo Decorativo V */}
        <div 
          className="mb-6 animate-fade-in"
          aria-hidden="true"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl"></div>
            <div className="relative w-14 h-14 border-2 border-gold/40 rounded-full flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-gold" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* 📋 Rótulo GUIA DE ESTUDO */}
        <p 
          className="text-[10px] tracking-[0.35em] text-gold/80 uppercase font-semibold mb-4 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          Guia de Estudo
        </p>

        {/* 🎯 Título Principal */}
        <h1 
          className="text-4xl md:text-6xl font-serif text-white font-light tracking-tight mb-3 animate-fade-in leading-tight drop-shadow-lg"
          style={{ animationDelay: '0.2s' }}
        >
          {titulo}
        </h1>

        {/* ✍️ Subtítulo em Itálico */}
        <p 
          className="text-lg md:text-xl font-serif italic text-gold mb-4 animate-fade-in drop-shadow-md"
          style={{ animationDelay: '0.3s' }}
        >
          {subtitulo}
        </p>

        {/* 📝 Descrição */}
        <p 
          className="text-sm md:text-base text-slate-200 leading-relaxed max-w-md animate-fade-in font-light mb-8 drop-shadow-md"
          style={{ animationDelay: '0.4s' }}
        >
          {descricao}
        </p>

        {/* 🎮 Botão Principal - Iniciar */}
        <button
          onClick={onStart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Iniciar tutorial guiado do Ambiente Espiritual"
          className="group relative overflow-hidden rounded-full py-4 px-8 font-semibold text-sm uppercase tracking-wide transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b2a] focus-visible:ring-gold min-h-[56px] animate-fade-in shadow-xl"
          style={{ animationDelay: '0.5s' }}
        >
          {/* Background animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold to-yellow-500 transition-transform duration-300"></div>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-gold/80 to-yellow-500/80 transition-opacity duration-300"
            style={{ opacity: isHovering ? 0 : 1 }}
          ></div>
          
          {/* Conteúdo */}
          <div className="relative flex items-center justify-center gap-3 text-[#1f1b2a]">
            <span>Iniciar</span>
            <ArrowRight 
              size={20} 
              aria-hidden="true"
              className="transition-transform duration-300"
              style={{ transform: isHovering ? 'translateX(4px)' : 'translateX(0)' }}
            />
          </div>
        </button>
      </div>

      {/* 🎨 CSS para Animações Customizadas */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
