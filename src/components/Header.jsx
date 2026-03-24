import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { LayoutDashboard, List, Calendar, KanbanSquare, Search, FilterX, CheckCircle2, Plus, Link as LinkIcon, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Header.css';

const Header = ({ activeTab, setActiveTab, onOpenModal }) => {
  const { filters, updateFilter, clearFilters, users, subjects, statuses, priorities, tags } = useTaskContext();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const hasActiveFilters = filters.assignee || filters.subject || filters.status || filters.priority || filters.search || filters.tag;

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

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {activeTab === 'dashboard' && (
            <button 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-surface-elevated)' }}
              onClick={async () => {
                const dashboardElement = document.getElementById('dashboard-report-content');
                if (!dashboardElement) return;
                
                const pdfHeader = document.getElementById('pdf-export-header');
                if (pdfHeader) pdfHeader.style.display = 'block';

                try {
                  const canvas = await html2canvas(dashboardElement, { scale: 2, useCORS: true, backgroundColor: '#0f172a' }); 
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape might be better for 12-col grid, let's keep A4 landscape or adjust scale
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                  
                  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                  pdf.save('TaskFlow_Report.pdf');
                } catch (err) {
                  console.error('Erro ao gerar PDF', err);
                } finally {
                  if (pdfHeader) pdfHeader.style.display = 'none';
                }
              }}
            >
              <Download size={18} />
              Exportar PDF
            </button>
          )}
          <button className="btn-primary" onClick={onOpenModal}>
            <Plus size={18} />
            Nova Tarefa
          </button>
        </div>
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
          value={filters.timeframe || ''}
          onChange={(e) => updateFilter('timeframe', e.target.value)}
        >
          <option value="">Todas as Datas</option>
          <option value="hoje">Hoje</option>
          <option value="amanha">Amanhã</option>
          <option value="esta_semana">Esta Semana</option>
          <option value="atrasadas">Atrasadas</option>
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

        <select 
          className="filter-select"
          value={filters.tag || ''}
          onChange={(e) => updateFilter('tag', e.target.value)}
        >
          <option value="">Todas as Tags</option>
          {tags.map(t => (
            <option key={t} value={t}>{t}</option>
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
