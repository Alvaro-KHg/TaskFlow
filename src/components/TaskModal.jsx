import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, Save, Plus, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar } from './UI';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask, deleteTask, users, subjects, statuses, priorities, taskTypes, tags } = useTaskContext();

  const initialFormState = {
    title: '',
    description: '',
    subject: subjects[0] || '',
    dueDate: new Date().toISOString().slice(0, 16),
    assigneeId: users[0]?.id || '',
    status: statuses[0] || 'A Fazer',
    priority: priorities[0] || 'Média',
    taskType: taskTypes[0] || 'Individual',
    tags: [],
    hoursSpent: 0,
    checklist: [],
    comments: []
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // States for new inputs
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentAuthorId, setCommentAuthorId] = useState(users[0]?.id || '');
  const [originalData, setOriginalData] = useState(null);

  // Populate data when editing
  useEffect(() => {
    if (taskToEdit && isOpen) {
      const data = {
        ...initialFormState,
        ...taskToEdit,
        dueDate: new Date(taskToEdit.dueDate).toISOString().slice(0, 16),
        checklist: taskToEdit.checklist || [],
        comments: taskToEdit.comments || []
      };
      setFormData(data);
      setOriginalData(data);
    } else if (isOpen) {
      setFormData(initialFormState);
      setOriginalData(initialFormState);
      setNewChecklistItem('');
      setNewComment('');
    }
  }, [taskToEdit, isOpen]);

  const handleClose = () => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);
    if (isDirty) {
      const confirmClose = window.confirm("Você tem alterações não salvas. Tem certeza que deseja sair sem salvar as alterações?");
      if (!confirmClose) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const selectedTags = options.map(opt => opt.value);
    setFormData(prev => ({ ...prev, tags: selectedTags }));
  };

  const handleAddChecklist = () => {
    if (!newChecklistItem.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [...(prev.checklist || []), { id: Date.now().toString(), text: newChecklistItem.trim(), done: false }]
    }));
    setNewChecklistItem('');
  };

  const toggleChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, done: !item.done } : item)
    }));
  };

  const removeChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setFormData(prev => ({
      ...prev,
      comments: [...(prev.comments || []), { 
        id: Date.now().toString(), 
        authorId: commentAuthorId, 
        text: newComment.trim(), 
        date: new Date().toISOString() 
      }]
    }));
    setNewComment('');
  };

  const handleDelete = () => {
    if (!taskToEdit) return;
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;
    deleteTask(taskToEdit.id);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button type="button" className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título</label>
              <input required type="text" className="form-input" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Estudar API do React" />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Detalhes adicionais..."></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Matéria</label>
                <select className="form-select" name="subject" value={formData.subject} onChange={handleChange}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Data de Entrega</label>
                <input required type="datetime-local" className="form-input" name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Responsável</label>
                <select className="form-select" name="assigneeId" value={formData.assigneeId} onChange={handleChange}>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Tarefa</label>
                <select className="form-select" name="taskType" value={formData.taskType} onChange={handleChange}>
                  {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Horas Gastas</label>
              <input type="number" min="0" step="0.5" className="form-input" name="hoursSpent" value={formData.hoursSpent} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Tags da Tarefa</label>
              <div className="tags-grid">
                {tags.map(t => (
                  <label key={t} className={`tag-checkbox-label ${formData.tags.includes(t) ? 'selected' : ''}`}>
                    <input 
                      type="checkbox" 
                      className="hidden-checkbox"
                      checked={formData.tags.includes(t)}
                      onChange={(e) => {
                        if (e.target.checked) setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
                        else setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
                      }}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Checklist Section */}
            <div className="form-section-divider"></div>
            <div className="form-group">
              <label className="form-label">Sub-tarefas (Checklist)</label>
              <div className="checklist-container">
                {formData.checklist && formData.checklist.map(item => (
                  <div key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={item.done} 
                      onChange={() => toggleChecklist(item.id)}
                      className="checklist-checkbox"
                    />
                    <span className="checklist-text">{item.text}</span>
                    <button type="button" onClick={() => removeChecklist(item.id)} className="btn-icon text-muted">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <div className="checklist-add">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nova sub-tarefa..." 
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddChecklist(); } }}
                  />
                  <button type="button" className="btn-secondary btn-sm" onClick={handleAddChecklist}>
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="form-section-divider"></div>
            <div className="form-group">
              <label className="form-label">Comentários</label>
              <div className="comments-list">
                {formData.comments && formData.comments.length === 0 && (
                  <div className="empty-comments">Nenhum comentário ainda.</div>
                )}
                {formData.comments && formData.comments.map(c => {
                  const author = users.find(u => u.id === c.authorId);
                  return (
                    <div key={c.id} className="comment-item">
                      <Avatar src={author?.avatar} alt={author?.name} size="sm" />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{author?.name || 'Usuário'}</span>
                          <span className="comment-date">{format(new Date(c.date), "dd MMM HH:mm", { locale: ptBR })}</span>
                        </div>
                        <div className="comment-text">{c.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="comment-input-area">
                <select 
                  className="form-select comment-author-select" 
                  value={commentAuthorId} 
                  onChange={(e) => setCommentAuthorId(e.target.value)}
                  title="Postando como..."
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}
                </select>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Escreva um comentário..."   
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                />
                <button type="button" className="btn-secondary btn-sm" onClick={handleAddComment}>
                  Enviar
                </button>
              </div>
            </div>

          </div>

          <div className="modal-footer">
            {taskToEdit && (
              <button type="button" className="btn-danger" onClick={handleDelete}>
                <Trash2 size={18} />
                Excluir
              </button>
            )}
            <div className="modal-footer-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancelar</button>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Salvar Tarefa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
