import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase.from('messages').insert([formData]);

    if (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="bg-black py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold font-mono text-white mb-4">
                Vamos criar algo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                  incrível juntos?
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Se você tem um projeto em mente, uma ideia de negócio ou apenas quer bater um papo sobre tecnologia, fique à vontade para entrar em contato.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl border border-white/10">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:edsonfreizer@gmail.com" className="text-lg font-medium hover:text-white transition-colors">
                    edsonfreizer@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl border border-white/10">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="text-lg font-medium">Cabinda, Angola</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-400">Nome</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-gray-600"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-gray-600"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-400">Mensagem</label>
                <textarea 
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-gray-600 resize-none"
                  placeholder="Conte-me sobre seu projeto..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-lg shadow-lg hover:shadow-white/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
                <FaPaperPlane className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </button>

              {status === 'success' && (
                <p className="text-white text-sm text-center">Mensagem enviada com sucesso!</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Erro ao enviar. Tente novamente.</p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
