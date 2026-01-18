import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FaTrash, FaPlus, FaEdit, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github_url: string;
  live_url: string;
  full_description: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({ tags: [] });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // States for Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    } catch (e) {
      console.error("Error extracting filename", e);
      return null;
    }
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    const fileName = getFileNameFromUrl(imageUrl);
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('portfolio')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setAlertMessage('Erro ao fazer upload da imagem!');
      return null;
    }
  };

  const confirmDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    
    setIsDeleteModalOpen(false);
    
    // 1. Delete image from storage if exists
    if (projectToDelete.image) {
      await deleteImageFromStorage(projectToDelete.image);
    }

    // 2. Delete record from database
    const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id);
    if (!error) {
      fetchProjects();
    } else {
      setAlertMessage('Erro ao excluir projeto: ' + error.message);
    }
    setProjectToDelete(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let imageUrl = currentProject.image;

    // Handle Image Upload
    if (selectedImage) {
      // If updating and there was an old image, delete it first
      if (currentProject.id && currentProject.image) {
        await deleteImageFromStorage(currentProject.image);
      }
      
      const newImageUrl = await uploadImage(selectedImage);
      if (newImageUrl) {
        imageUrl = newImageUrl;
      } else {
        setUploading(false);
        return; // Stop if upload failed
      }
    }

    const projectData = { ...currentProject, image: imageUrl };
    
    if (currentProject.id) {
       // Update
       const { error } = await supabase.from('projects').update(projectData).eq('id', currentProject.id);
       if (!error) {
         setIsEditing(false);
         fetchProjects();
       } else {
         setAlertMessage('Error updating project: ' + error.message);
       }
    } else {
       // Create
       const { error } = await supabase.from('projects').insert([projectData]);
       if (!error) {
         setIsEditing(false);
         fetchProjects();
       } else {
          setAlertMessage('Error creating project: ' + error.message);
       }
    }
    setUploading(false);
  };

  const openModal = (project: Partial<Project> = { tags: [] }) => {
    setCurrentProject(project);
    setSelectedImage(null); // Reset selected image
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Gerenciar Projetos</h2>
        <button 
          onClick={() => openModal()}
          className="bg-white hover:bg-gray-200 text-black font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Novo Projeto
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-xl">
              <p className="text-gray-500">Nenhum projeto encontrado. Adicione seu primeiro projeto!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                  <img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-white font-bold truncate">{project.title}</h3>
                    <p className="text-gray-500 text-sm truncate max-w-md">{project.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal(project)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => confirmDelete(project)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Main Edit/Create Modal (We can keep this as full screen overlay or reuse Custom Modal if we want, but keeping current form overlay is fine for now, user asked for dialogs/alerts) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/20 p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">{currentProject.id ? 'Editar' : 'Novo'} Projeto</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Título</label>
                <input 
                  className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                  value={currentProject.title || ''}
                  onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                  required 
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Descrição Curta</label>
                <input 
                  className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                  value={currentProject.description || ''}
                  onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                  required 
                />
              </div>

               <div>
                <label className="text-gray-400 text-sm mb-2 block">Imagem do Projeto</label>
                
                {/* Image Preview */}
                {(currentProject.image || selectedImage) && (
                  <div className="mb-2 relative w-full h-48 bg-black/50 rounded overflow-hidden border border-gray-700">
                    <img 
                      src={selectedImage ? URL.createObjectURL(selectedImage) : currentProject.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <input 
                    type="file" 
                    id="image-upload"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedImage(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded cursor-pointer border border-dashed border-gray-600"
                  >
                    <FaImage /> {selectedImage ? 'Alterar Imagem' : 'Selecionar Imagem'}
                  </label>
                  {selectedImage && <p className="text-xs text-white mt-1">Nova imagem selecionada: {selectedImage.name}</p>}
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-gray-400 text-sm">GitHub URL</label>
                    <input 
                      className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                      value={currentProject.github_url || ''}
                      onChange={e => setCurrentProject({...currentProject, github_url: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-gray-400 text-sm">Live URL</label>
                    <input 
                      className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                      value={currentProject.live_url || ''}
                      onChange={e => setCurrentProject({...currentProject, live_url: e.target.value})}
                    />
                 </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Tags (separadas por vírgula)</label>
                <input 
                  className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                  value={currentProject.tags?.join(', ') || ''}
                  onChange={e => setCurrentProject({...currentProject, tags: e.target.value.split(',').map(tag => tag.trim())})}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Descrição Detalhada</label>
                <textarea 
                  rows={5}
                  className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" 
                  value={currentProject.full_description || ''}
                  onChange={e => setCurrentProject({...currentProject, full_description: e.target.value})}
                  required 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-2 rounded disabled:opacity-50 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Projeto"
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
              Excluir Definitivamente
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <FaExclamationTriangle className="text-3xl text-red-500" />
          <div>
            <p>Tem certeza que deseja excluir o projeto <strong className="text-white">{projectToDelete?.title}</strong>?</p>
            <p className="text-sm mt-2 text-red-400/80">Esta ação não pode ser desfeita e a imagem associada será removida.</p>
          </div>
        </div>
      </Modal>

      {/* General Alert Modal */}
      <Modal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title="Atenção"
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
