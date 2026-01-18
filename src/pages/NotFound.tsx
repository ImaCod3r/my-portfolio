import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaExclamationTriangle className="text-white text-6xl animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">
          Ops! O conteúdo que você está procurando não existe ou foi movido para outro endereço.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <FaHome size={18} />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
