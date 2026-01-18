import { useParams, useNavigate } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { Project } from './Projects';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (!error && data) {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Projeto não encontrado</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-white hover:underline"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-white/30">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover object-center grayscale"
        />
        
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all font-medium border border-white/10"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Title & Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm font-mono text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 shrink-0">
               {project.live_url && (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-6 py-3 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-white/20"
                >
                  <FaExternalLinkAlt /> Demo Live
                </a>
               )}
              {project.github_url && (
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-transform hover:scale-105"
                >
                  <FaGithub /> GitHub
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6 text-lg leading-relaxed">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-white rounded-full"></span>
              Sobre o Projeto
            </h3>
            <p className="text-gray-300">
              {project.full_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
