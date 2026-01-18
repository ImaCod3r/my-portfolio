import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });

        setStats({
          projects: projectsCount || 0,
          messages: messagesCount || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-white">Loading stats...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Card */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Projetos</h3>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
              <FaProjectDiagram />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{stats.projects}</p>
        </div>

        {/* Messages Card */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Mensagens Recebidas</h3>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400">
              <FaEnvelope />
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{stats.messages}</p>
        </div>
      </div>
    </div>
  );
}
