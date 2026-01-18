import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { FaExclamationCircle } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold font-mono text-center mb-8">
          <span className="text-white opacity-50">Admin</span> Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-3 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-3 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <Modal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Erro de Login"
        type="danger"
        footer={
           <button 
              onClick={() => setError(null)}
              className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Tentar Novamente
            </button>
        }
      >
        <div className="flex items-center gap-4">
          <FaExclamationCircle className="text-3xl text-red-500" />
          <p className="text-gray-300">{error === 'Invalid login credentials' ? 'Credenciais inválidas. Verifique seu email e senha.' : error}</p>
        </div>
      </Modal>
    </div>
  );
}
