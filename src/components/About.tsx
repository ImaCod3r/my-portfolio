import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import edsonPhoto from '../assets/edson.jpg';

export default function About() {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const lines = codeRef.current.querySelectorAll('.code-line');
      
      gsap.fromTo(
        lines,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }
  }, []);

  const developerInfo = {
    name: "Edson Rodrigues",
    age: 20,
    location: {
      city: "Cabinda",
      country: "Angola"
    },
    role: "Full Stack Developer",
    experience: {
      years: 5,
      technologies: [
        "Web Development",
        "Python",
        "Java"
      ]
    },
    passion: "Transformando ideias em código",
    available: true
  };

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center bg-black py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono mb-4">
            <span className="text-white/50">&lt;</span>
            <span className="text-white">Sobre Mim</span>
            <span className="text-white/50">/&gt;</span>
          </h2>
          <p className="text-gray-500 text-lg">Conheça um pouco mais sobre minha jornada</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2 items-center">
          {/* Photo Section */}
          <div className="flex justify-center order-1">
            <div className="relative group">
              {/* Decorative border */}
              <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
              
              {/* Photo container */}
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 rounded-lg"></div>
                <div className="relative overflow-hidden rounded-lg border-2 border-white/30 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  <img
                    src={edsonPhoto}
                    alt="Edson Rodrigues"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* JSON Code Block */}
          <div className="order-2 max-w-lg">
            <div className="relative">
              {/* Code window header */}
              <div className="bg-gray-950 rounded-t-lg border border-white/20 border-b-0 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <div className="w-3 h-3 rounded-full bg-white/70"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm font-mono">about.json</span>
              </div>

              {/* Code content */}
              <div className="bg-gray-950 rounded-b-lg border border-white/20 p-6 font-mono text-sm overflow-x-auto">
                <pre ref={codeRef} className="text-gray-300">
                  <div className="code-line"><span className="text-white opacity-50">{'{'}</span></div>
                  <div className="code-line">  <span className="text-gray-400">"name"</span>: <span className="text-white">"{developerInfo.name}"</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"age"</span>: <span className="text-white">{developerInfo.age}</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"location"</span>: <span className="text-white/50">{'{'}</span></div>
                  <div className="code-line">    <span className="text-gray-400">"city"</span>: <span className="text-white">"{developerInfo.location.city}"</span>,</div>
                  <div className="code-line">    <span className="text-gray-400">"country"</span>: <span className="text-white">"{developerInfo.location.country}"</span></div>
                  <div className="code-line">  <span className="text-white/50">{'}'}</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"role"</span>: <span className="text-white">"{developerInfo.role}"</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"experience"</span>: <span className="text-white/50">{'{'}</span></div>
                  <div className="code-line">    <span className="text-gray-400">"years"</span>: <span className="text-white">{developerInfo.experience.years}</span>,</div>
                  <div className="code-line">    <span className="text-gray-400">"technologies"</span>: <span className="text-white/50">[</span></div>
                  {developerInfo.experience.technologies.map((tech, index) => (
                    <div key={index} className="code-line">
                      {"      "}<span className="text-white">"{tech}"</span>{index < developerInfo.experience.technologies.length - 1 ? ',' : ''}
                    </div>
                  ))}
                  <div className="code-line">    <span className="text-white/50">]</span></div>
                  <div className="code-line">  <span className="text-white/50">{'}'}</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"passion"</span>: <span className="text-white">"{developerInfo.passion}"</span>,</div>
                  <div className="code-line">  <span className="text-gray-400">"available"</span>: <span className="text-white">{developerInfo.available.toString()}</span></div>
                  <div className="code-line"><span className="text-white/50">{'}'}</span></div>
                </pre>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-white/5 rounded-lg blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
