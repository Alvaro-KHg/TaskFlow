import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { LayoutDashboard, List, Calendar, KanbanSquare, Search, FilterX, CheckCircle2, Plus, Link as LinkIcon } from 'lucide-react';
import './Header.css';

const Header = ({ activeTab, setActiveTab, onOpenModal }) => {
  const { filters, updateFilter, clearFilters, users, subjects, statuses, priorities } = useTaskContext();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const hasActiveFilters = filters.assignee || filters.subject || filters.status || filters.priority || filters.search;

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-title">
          <CheckCircle2 className="highlight" size={28} />
          <span>Task<span className="highlight">Flow</span> Academy</span>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => handleTabChange('kanban')}
          >
            <KanbanSquare size={18} />
            Kanban
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => handleTabChange('list')}
          >
            <List size={18} />
            Lista
          </button>
          <button 
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => handleTabChange('calendar')}
          >
            <Calendar size={18} />
            Calendário
          </button>
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => handleTabChange('links')}
          >
            <LinkIcon size={18} />
            Links
          </button>
        </div>

        <button className="btn-primary" onClick={onOpenModal}>
          <Plus size={18} />
          Nova Tarefa
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar tarefas..." 
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={filters.assignee}
          onChange={(e) => updateFilter('assignee', e.target.value)}
        >
          <option value="">Todos os Membros</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={filters.subject}
          onChange={(e) => updateFilter('subject', e.target.value)}
        >
          <option value="">Todas as Matérias</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">Todos os Status</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value)}
        >
          <option value="">Todas as Prioridades</option>
          {priorities.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <FilterX size={16} />
            Limpar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
