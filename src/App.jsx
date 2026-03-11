import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import LinksView from './components/LinksView';

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
    </div>
  );
}

export default App;
