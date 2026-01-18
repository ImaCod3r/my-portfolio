import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FaTrash, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [refreshKey]);

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!messageToDelete) return;
    
    setIsDeleteModalOpen(false);
    
    const { error } = await supabase.from('messages').delete().eq('id', messageToDelete);
    if (!error) setRefreshKey(prev => prev + 1);
    
    setMessageToDelete(null);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Mensagens de Contato</h2>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="space-y-4">
          {messages.length === 0 && <p className="text-gray-500">Nenhuma mensagem encontrada.</p>}
          
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold truncate">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-white text-sm hover:underline block truncate opacity-70">{msg.email}</a>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                  <span className="text-gray-500 text-sm">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDeleteClick(msg.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="bg-black/30 p-4 rounded text-gray-300 whitespace-pre-wrap border border-gray-800">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Mensagem"
        type="danger"
        footer={
          <>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={executeDelete}
              className="px-4 py-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/50"
            >
              Excluir
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <FaExclamationTriangle className="text-3xl text-red-500" />
          <div>
            <p>Tem certeza que deseja excluir esta mensagem?</p>
            <p className="text-sm mt-2 text-red-400/80">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
