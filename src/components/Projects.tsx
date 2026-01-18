import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github_url: string;
  live_url: string;
  full_description: string;
}

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
        if (!error && data) {
          setProjects(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono mb-4">
            <span className="text-white/50">&lt;</span>
            <span className="text-white">Projetos</span>
            <span className="text-white/50">/&gt;</span>
          </h2>
          <p className="text-gray-500 text-lg">Alguns dos meus trabalhos recentes</p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-mono border border-white px-4 py-2 rounded pointer-events-none">
                      Ver Detalhes
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 
                    className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-white bg-white/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-auto">
                    {project.live_url && (
                      <a 
                        href={project.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black text-sm font-bold py-2 rounded transition-colors"
                      >
                        <FaExternalLinkAlt /> Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white text-sm font-bold py-2 rounded transition-colors"
                      >
                        <FaGithub /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-500 font-mono text-lg">Nenhum projeto encontrado no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
