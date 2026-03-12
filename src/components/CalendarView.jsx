import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';

const CalendarView = ({ onEditTask }) => {
  const { filteredTasks } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // A semana começa na segunda-feira (1) a pedido do usuário
  let startDate = startOfWeek(monthStart, { locale: ptBR, weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { locale: ptBR, weekStartsOn: 1 });

  // Ocultar semanas passadas se estivermos visualizando o mês atual
  const today = new Date();
  if (isSameMonth(currentDate, today)) {
    const thisWeekStart = startOfWeek(today, { locale: ptBR, weekStartsOn: 1 });
    if (thisWeekStart > startDate) {
      startDate = thisWeekStart;
    }
  }

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day) => {
    return filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      // Cria uma data com base na string salva sem ajustar fuso horário local que desloca o dia
      const taskDate = new Date(task.dueDate);
      // Fallback em caso de conversão inválida
      if (isNaN(taskDate.getTime())) return false;
      
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };

  return (
    <div className="calendar-container animate-fade-in">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          <ChevronLeft size={20} />
        </button>
        <div className="calendar-title" style={{textTransform: 'capitalize'}}>
          {format(currentDate, dateFormat, { locale: ptBR })}
        </div>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            const isOtherMonth = !isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={`calendar-day-cell ${isOtherMonth ? 'is-other-month' : ''} ${isTodayDate ? 'is-today' : ''}`}
              >
                <div className="calendar-day-header">
                  <span className="day-number">{format(day, 'd')}</span>
                </div>
                <div className="calendar-tasks-list">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={`calendar-task-item border-prio--${task.priority.replace(/\s+/g, '.')}`}
                      onClick={() => onEditTask(task)}
                      title={task.title}
                    >
                      {format(new Date(task.dueDate), 'HH:mm')} - {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="calendar-task-more" title={dayTasks.slice(3).map(t => t.title).join('\n')}>
                      +{dayTasks.length - 3} tarefas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
