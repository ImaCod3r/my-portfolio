import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-scroll";
import { supabase } from "../lib/supabaseClient";

// Components
import { Button, buttonVariants } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Hero() {
  const nameRef = useRef<HTMLSpanElement>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { data, error: listError } = await supabase.storage
          .from("portfolio")
          .list();

        if (listError) throw listError;

        const hasCv = data?.some((file) => file.name === "cv.pdf");

        if (hasCv) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio")
            .getPublicUrl("cv.pdf");

          setCvUrl(`${publicUrlData.publicUrl}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCv();

    if (nameRef.current) {
      const text = nameRef.current.textContent || "";
      nameRef.current.textContent = "";

      const chars = text.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        nameRef.current?.appendChild(span);
      });

      gsap.to(nameRef.current.children, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
        ease: "none",
      });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16"
    >
      {/* Flickering Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FlickeringGrid
          color="#ffffff"
          maxOpacity={0.15}
          flickerChance={0.2}
          squareSize={4}
          gridGap={6}
        />
      </div>


      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
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
            Desenvolvedor{" "}
            <span className="text-white font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
              Full Stack
            </span>
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-gray-100 text-base sm:text-lg md:text-xl leading-relaxed pt-2">
            Transformando ideias em experiências digitais incríveis através de
            código limpo e design moderno.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="projects"
              smooth={true}
              duration={500}
              offset={-80}
              className={buttonVariants({
                size: "lg",
                className:
                  "w-full sm:w-auto group cursor-pointer shadow-white/20 hover:scale-105 hover:shadow-white/30",
              })}
            >
              Ver Projetos
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Button
              variant="link"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                if (!cvUrl) return;
                window.open(cvUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Baixar CV
            </Button>
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
    </section>
  );
}
