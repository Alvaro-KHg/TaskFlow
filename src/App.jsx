import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import LinksView from './components/LinksView';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kanban':
        return <KanbanView onEditTask={openEditTaskModal} />;
      case 'list':
        return <ListView onEditTask={openEditTaskModal} />;
      case 'calendar':
        return <CalendarView onEditTask={openEditTaskModal} />;
      case 'dashboard':
        return <DashboardView />;
      case 'links':
        return <LinksView />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenModal={openNewTaskModal} />
      <main className="main-content">
        {renderContent()}
      </main>
      
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={taskToEdit} 
      />

      {/* Container Global de Notificações Toast */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
          },
          success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } }
        }}
      />
    </div>
  );
}

export default App;
