import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Tag, Avatar } from './UI';
import './KanbanView.css';

const KanbanCard = ({ task, onEdit, index }) => {
  const { users, subjects } = useTaskContext();
  const assignee = users.find(u => u.id === task.assigneeId);
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Concluído';
  const subjectIndex = subjects.indexOf(task.subject);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div 
          className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task)}
        >
          <div className="card-top">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant="priority" value={task.priority} />
              <Badge variant="type" value={task.taskType || 'Individual'} />
            </div>
          </div>
          <h4 className="card-title">{task.title}</h4>
          <div className="card-subject" style={{marginTop: '0.5rem'}}>
            <Badge variant="subject" value={task.subject} subjectIndex={subjectIndex} />
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="card-tags">
              {task.tags.map(t => <Tag key={t} text={t} />)}
            </div>
          )}

          <div className="card-footer" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem'}}>
            <div className="card-meta-info" style={{ color: isOverdue ? 'var(--color-danger)' : '' }}>
              <Clock size={14} />
              <span style={{textTransform: 'capitalize'}}>{format(new Date(task.dueDate), "EEE, dd MMM", { locale: ptBR })}</span>
            </div>
            {assignee && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Avatar src={assignee.avatar} alt={assignee.name} size="sm" tooltip={assignee.name} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {assignee.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const KanbanView = ({ onEditTask }) => {
  const { statuses, filteredTasks, moveTask } = useTaskContext();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return; // Dropped in the same column

    moveTask(draggableId, destination.droppableId);
  };

  return (
    <div className="kanban-board animate-fade-in">
      <DragDropContext onDragEnd={handleDragEnd}>
        {statuses.map(status => {
          const columnTasks = filteredTasks.filter(t => t.status === status);

          return (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                {status}
                <span className="column-count">{columnTasks.length}</span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div 
                    className={`kanban-column-body ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columnTasks.map((task, index) => (
                      <KanbanCard 
                        key={task.id} 
                        task={task} 
                        index={index} 
                        onEdit={onEditTask} 
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
