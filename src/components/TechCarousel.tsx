import { FaReact, FaNodeJs, FaJava, FaPython, FaGitAlt, FaFigma } from "react-icons/fa";
import { BiLogoPostgresql, BiLogoTailwindCss } from "react-icons/bi";
import { SiNextdotjs, SiTypescript } from "react-icons/si";

export default function TechCarousel() {
  const techs = [
    { name: "React", icon: FaReact },
    { name: "Node.js", icon: FaNodeJs },
    { name: "PostgreSQL", icon: BiLogoPostgresql },
    { name: "Tailwind", icon: BiLogoTailwindCss },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "Java", icon: FaJava },
    { name: "Python", icon: FaPython },
    { name: "Git", icon: FaGitAlt },
    { name: "Figma", icon: FaFigma },
    { name: "TypeScript", icon: SiTypescript },
  ];

  return (
    <section className="bg-black py-10 overflow-hidden relative border-t border-white/5 shadow-[0_-1px_10px_rgba(255,255,255,0.05)]">
        {/* Gradient Overlay left and right */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>

      <div className="w-[200%] flex animate-scroll hover:[animation-play-state:paused]">
        {[...techs, ...techs].map((tech, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full min-w-[150px] mx-4 group cursor-pointer"
          >
            {/* Minimalist styling: Gray by default, White on hover */}
            <div className="text-5xl mb-2 transition-all duration-300 group-hover:scale-125 text-gray-500 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              <tech.icon />
            </div>
            <span className="text-gray-600 font-mono text-sm group-hover:text-white transition-colors duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
