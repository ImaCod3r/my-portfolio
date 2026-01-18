import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FaFilePdf, FaUpload, FaDownload, FaTrash } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';

export default function Settings() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCvUrl();
  }, []);

  const fetchCvUrl = async () => {
    try {
      // We check if cv.pdf exists in the portfolio bucket
      const { data, error } = await supabase.storage
        .from('portfolio')
        .list();

      if (error) throw error;

      const hasCv = data?.some(file => file.name === 'cv.pdf');

      if (hasCv) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl('cv.pdf');
        
        // Add a timestamp to avoid caching issues during upload/preview
        setCvUrl(`${publicUrlData.publicUrl}?t=${new Date().getTime()}`);
      } else {
        setCvUrl(null);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const handleUpload = async () => {
    if (!cvFile) return;

    setUploading(true);
    try {
      const { error } = await supabase.storage
        .from('portfolio')
        .upload('cv.pdf', cvFile, {
          upsert: true,
          contentType: 'application/pdf'
        });

      if (error) throw error;

      setAlertMessage('CV atualizado com sucesso!');
      fetchCvUrl();
      setCvFile(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setAlertMessage('Erro ao fazer upload: ' + message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.storage
        .from('portfolio')
        .remove(['cv.pdf']);

      if (error) throw error;

      setAlertMessage('CV removido com sucesso!');
      setCvUrl(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setAlertMessage('Erro ao remover: ' + message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Configurações</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CV Management Card */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
              <FaFilePdf size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Currículo (CV)</h3>
          </div>

          {cvUrl ? (
            <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-500 text-2xl" />
                  <div>
                    <p className="text-white font-medium">cv.pdf</p>
                    <p className="text-gray-500 text-xs">Arquivo carregado atualmente</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    title="Visualizar"
                  >
                    <FaDownload />
                  </a>
                  <button 
                    onClick={handleDelete}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-6 border-2 border-dashed border-gray-800 rounded-lg text-center">
              <p className="text-gray-500">Nenhum currículo enviado.</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="file" 
                id="cv-upload"
                accept=".pdf"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setCvFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <label 
                htmlFor="cv-upload"
                className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded cursor-pointer border border-gray-700 transition-colors"
              >
                <FaUpload /> {cvFile ? 'PDF Selecionado' : 'Selecionar Novo PDF'}
              </label>
              {cvFile && (
                <p className="text-xs text-white mt-2 flex items-center gap-2">
                  Pronto para upload: <span className="font-mono">{cvFile.name}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!cvFile || uploading}
              className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold py-3 rounded-lg transition-all shadow-lg shadow-white/5"
            >
              {uploading ? 'Enviando...' : 'Salvar Currículo'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title="Notificação"
        type="default"
        footer={
          <button 
            onClick={() => setAlertMessage(null)}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            OK
          </button>
        }
      >
        <p>{alertMessage}</p>
      </Modal>
    </div>
  );
}
