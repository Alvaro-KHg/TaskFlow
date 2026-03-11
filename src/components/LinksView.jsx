import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { ExternalLink, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import './LinksView.css';

const LinksView = () => {
  const { links, addLink, deleteLink } = useTaskContext();
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleAddLink = (e) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      addLink({ ...newLink, url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}` });
      setNewLink({ title: '', url: '' });
    }
  };

  return (
    <div className="links-container animate-fade-in">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LinkIcon size={24} className="highlight" />
        Links Importantes
      </h2>

      <form className="add-link-form" onSubmit={handleAddLink}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Título do Link</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: Drive da Turma" 
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">URL (Endereço Web)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: drive.google.com/..." 
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <Plus size={18} />
          Adicionar
        </button>
      </form>

      <div className="links-grid">
        {links.map((link) => (
          <div className="link-card" key={link.id}>
            <button className="link-delete" onClick={() => deleteLink(link.id)} title="Remover link">
              <Trash2 size={16} />
            </button>
            <div className="link-title">
              <ExternalLink size={20} />
              {link.title}
            </div>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-action">
              Acessar Link
            </a>
          </div>
        ))}
        {links.length === 0 && (
          <div style={{ color: 'var(--text-muted)' }}>Nenhum link adicionado ainda.</div>
        )}
      </div>
    </div>
  );
};

export default LinksView;
