import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import MatrixRain from './MatrixRain';
import { Link } from 'react-scroll';
import { supabase } from '../lib/supabaseClient';

export default function Hero() {
  const nameRef = useRef<HTMLSpanElement>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { data, error: listError } = await supabase.storage
          .from('portfolio')
          .list();

        if (listError) throw listError;

        const hasCv = data?.some(file => file.name === 'cv.pdf');

        if (hasCv) {
          const { data: publicUrlData } = supabase.storage
            .from('portfolio')
            .getPublicUrl('cv.pdf');
          
          setCvUrl(`${publicUrlData.publicUrl}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
      }
    };

    fetchCv();

    if (nameRef.current) {
      const text = nameRef.current.textContent || '';
      nameRef.current.textContent = '';
      
      const chars = text.split('');
      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        nameRef.current?.appendChild(span);
      });

      gsap.to(nameRef.current.children, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
        ease: 'none',
      });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16"
    >
      {/* Matrix Rain Effect */}
      <MatrixRain />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-4 animate-fade-in">

          {/* Name as Tag */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold">
            <span className="text-white opacity-50">&lt;</span>
            <span 
              ref={nameRef}
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              Edson Rodrigues
            </span>
            <span className="text-white opacity-50">/&gt;</span>
          </h1>

          {/* Title/Role */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light">
            Desenvolvedor{' '}
            <span className="text-white font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
              Full Stack
            </span>
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed pt-2">
            Transformando ideias em experiências digitais incríveis através de código limpo e design moderno.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="projects"
              smooth={true}
              duration={500}
              offset={-80}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-medium text-black font-semibold shadow-lg shadow-white/20 transition-all hover:scale-105 hover:bg-gray-200 hover:shadow-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full sm:w-auto group cursor-pointer"
            >
              Ver Projetos
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Edson_Rodrigues_CV.pdf"
                className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-transparent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto cursor-pointer"
              >
                Download CV
              </a>
            ) : (
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-transparent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto cursor-pointer"
              >
                Download CV
              </Link>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <Link
              to="about"
              smooth={true}
              duration={500}
              offset={-80}
              className="inline-block text-gray-600 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 animate-spin-slow shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
      </div>
      <div className="absolute top-20 right-20 hidden lg:block">
        <div className="w-16 h-16 border-2 border-white/20 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
      </div>
    </section>
  );
}
