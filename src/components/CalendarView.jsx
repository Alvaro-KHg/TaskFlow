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
  
  // A semana pode começar na segunda-feira em ptBR, depende da config, mas vamos manter o default base.
  const startDate = startOfWeek(monthStart, { locale: ptBR });
  const endDate = endOfWeek(monthEnd, { locale: ptBR });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day) => {
    return filteredTasks.filter(task => isSameDay(new Date(task.dueDate), day));
  };

  return (
    <div className="calendar-container animate-fade-in">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          <ChevronLeft size={20} />
        </button>
        <div className="calendar-title">
          {format(currentDate, dateFormat, { locale: ptBR })}
        </div>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
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
                <span className="day-number">{format(day, 'd')}</span>
                <div className="calendar-tasks-list">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`calendar-task-item border-prio--${task.priority.replace(/\s+/g, '.')}`}
                      onClick={() => onEditTask(task)}
                      title={task.title}
                    >
                      {format(new Date(task.dueDate), 'HH:mm')} - {task.title}
                    </div>
                  ))}
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
