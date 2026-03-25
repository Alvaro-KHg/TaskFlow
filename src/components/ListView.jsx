import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Avatar } from './UI';
import { Edit2, CheckCircle2 } from 'lucide-react';
import './ListView.css';

const ListView = ({ onEditTask }) => {
  const { filteredTasks, users, subjects } = useTaskContext();

  const getAssignee = (id) => users.find(u => u.id === id);

  return (
    <div className="list-container animate-fade-in">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Matéria</th>
            <th>Responsável</th>
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
                  {assignee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {assignee.name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                  {!assignee && <span style={{ color: 'var(--text-muted)' }}>-</span>}
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
