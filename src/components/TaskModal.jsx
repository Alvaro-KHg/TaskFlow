import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, Save } from 'lucide-react';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask, users, subjects, statuses, priorities, taskTypes, tags } = useTaskContext();

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
    hoursSpent: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  // Populate data when editing
  useEffect(() => {
    if (taskToEdit && isOpen) {
      setFormData({
        ...taskToEdit,
        dueDate: new Date(taskToEdit.dueDate).toISOString().slice(0, 16)
      });
    } else if (isOpen) {
      setFormData(initialFormState);
    }
  }, [taskToEdit, isOpen]);

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button className="modal-close" onClick={onClose}>
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
              <label className="form-label">Tags da Tarefa (Ctrl/Cmd para múltipla escolha)</label>
              <select multiple className="form-select" name="tags" value={formData.tags} onChange={handleTagsChange} size={3}>
                {tags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <Save size={18} />
              Salvar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
