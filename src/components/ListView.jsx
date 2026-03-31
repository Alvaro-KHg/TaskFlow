import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Avatar } from './UI';
import { Edit2, CheckCircle2 } from 'lucide-react';
import './ListView.css';

const ListView = ({ onEditTask }) => {
  const { filteredTasks, users, subjects, updateTask } = useTaskContext();

  const getAssignee = (id) => users.find(u => u.id === id);

  return (
    <div className="list-container animate-fade-in">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Matéria</th>
            <th>Responsável</th>
            <th>Estimativa</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Entrega</th>
            <th className="text-right">Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => {
            const assignee = getAssignee(task.assigneeId);
            const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== 'Concluído' : false;

            return (
              <tr key={task.id} style={{ opacity: task.status === 'Concluído' ? 0.7 : 1 }}>
                <td className="cell-title">
                  <div style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: task.status === 'Concluído' ? 'line-through' : 'none'}}>
                    {task.status === 'Concluído' && <CheckCircle2 size={16} color="var(--color-success)" />}
                    {task.title}
                  </div>
                  <Badge variant="type" value={task.taskType || 'Individual'} />
                </td>
                <td className="cell-subject">
                  <Badge variant="subject" value={task.subject} subjectIndex={subjects.indexOf(task.subject)} />
                </td>
                <td>
                  <select 
                    value={task.assigneeId || ''} 
                    onChange={(e) => updateTask(task.id, { assigneeId: e.target.value })}
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', color: 'inherit', outline: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    <option value="" style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)' }}>-</option>
                    {users.map(u => <option key={u.id} value={u.id} style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)' }}>{u.name.split(' ')[0]}</option>)}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={task.hoursSpent || 0}
                    onBlur={(e) => {
                      if (e.target.value !== String(task.hoursSpent)) {
                        updateTask(task.id, { hoursSpent: e.target.value });
                      }
                    }}
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', color: 'inherit', outline: 'none', width: '60px', padding: '4px 8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.875rem' }}
                    min="0" step="0.5"
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>h</span>
                </td>
                <td><Badge variant="status" value={task.status} /></td>
                <td><Badge variant="priority" value={task.priority} /></td>
                <td className="cell-date" style={{ color: isOverdue ? 'var(--color-danger)' : '', textTransform: 'capitalize' }}>
                  {task.dueDate ? format(new Date(task.dueDate), "EEE, dd MMM - HH:mm", { locale: ptBR }) : '-'}
                </td>
                <td className="cell-actions">
                  <button className="btn-icon" onClick={() => onEditTask(task)} title="Editar Tarefa">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredTasks.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Nenhuma tarefa encontrada com os filtros atuais.
        </div>
      )}
    </div>
  );
};

export default ListView;
