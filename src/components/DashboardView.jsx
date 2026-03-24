import React, { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, Clock, Download, List as ListIcon, BarChart3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './DashboardView.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardView = () => {
  const { filteredTasks, users, subjects } = useTaskContext();

  // 1. Gráfico de Participação (Horas trabalhadas por membro)
  const participationData = useMemo(() => {
    const hoursByUser = {};
    users.forEach(u => hoursByUser[u.id] = 0);
    let totalHoursCount = 0;

    filteredTasks.forEach(t => {
      const hours = Number(t.hoursSpent) || 0;
      if (t.assigneeId && hours > 0) {
        hoursByUser[t.assigneeId] += hours;
        totalHoursCount += hours;
      }
    });

    const labels = users.map(u => {
      const hours = hoursByUser[u.id];
      const perc = totalHoursCount > 0 ? Math.round((hours / totalHoursCount) * 100) : 0;
      return `${u.name.split(' ')[0]} (${perc}%)`;
    });
    const data = users.map(u => hoursByUser[u.id]);
    
    // Paleta premium
    const bgColors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: bgColors.map(c => `${c}CC`),
          borderColor: bgColors,
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTasks, users]);

  const contributionData = useMemo(() => {
    const hoursByUser = {};
    users.forEach(u => hoursByUser[u.id] = 0);
    
    filteredTasks.forEach(t => {
      const hours = Number(t.hoursSpent) || 0;
      if (t.assigneeId && t.status !== 'A Fazer') {
        hoursByUser[t.assigneeId] += hours; // Sum of Estimate
      }
    });

    const sortedUsers = [...users].sort((a, b) => {
      const hoursA = hoursByUser[a.id];
      const hoursB = hoursByUser[b.id];
      if (hoursB !== hoursA) {
        return hoursB - hoursA; // Descending
      }
      return a.name.localeCompare(b.name); // Alphabetical fallback
    });

    const labels = sortedUsers.map(u => u.name.split(' ')[0]);
    const data = sortedUsers.map(u => hoursByUser[u.id]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Sum of Estimate',
          data,
          backgroundColor: '#3b82f633', // Light blue fill
          borderColor: '#3b82f6', // solid blue border
          borderWidth: 2,
        },
      ],
    };
  }, [filteredTasks, users]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#f8fafc', font: { family: 'Inter' } } },
      tooltip: { theme: 'dark' }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#f8fafc', font: { family: 'Inter' } } },
      tooltip: { theme: 'dark' }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  // 2. Relatório de Horas (Tabulado por matéria e membro)
  // Como é uma tabela simples e a matriz Matéria x Membro pode ficar grande, 
  // vamos fazer agrupamento: Listar todas as matérias que têm horas, e quem gastou.
  // Ou melhor: Tabela: Matéria | Total Horas | Principais Contribuintes
  
  const hoursReportData = useMemo(() => {
    const report = {};
    subjects.forEach(s => report[s] = { total: 0, byUser: {} });

    filteredTasks.forEach(task => {
      const hours = Number(task.hoursSpent) || 0;
      if (hours > 0 && task.subject) {
        if (!report[task.subject]) report[task.subject] = { total: 0, byUser: {} };
        report[task.subject].total += hours;
        
        if (task.assigneeId) {
          if (!report[task.subject].byUser[task.assigneeId]) report[task.subject].byUser[task.assigneeId] = 0;
          report[task.subject].byUser[task.assigneeId] += hours;
        }
      }
    });

    return Object.entries(report)
      .filter(([_, data]) => data.total > 0)
      .sort((a, b) => b[1].total - a[1].total);
  }, [filteredTasks, subjects]);

  const getUserName = (id) => users.find(u => u.id === id)?.name.split(' ')[0] || 'Desconhecido';

  // Resumo Geral (Cards Top)
  const totalTasks = filteredTasks.length;
  const totalCompleted = filteredTasks.filter(t => t.status === 'Concluído').length;
  const totalHours = filteredTasks.reduce((acc, curr) => acc + (Number(curr.hoursSpent) || 0), 0);

  const handleExportPDF = async () => {
    const dashboardElement = document.getElementById('dashboard-report-content');
    if (!dashboardElement) return;

    try {
      const canvas = await html2canvas(dashboardElement, { scale: 2, useCORS: true, backgroundColor: '#0f172a' }); // Using a dark background color default
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('TaskFlow_Report.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF', err);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-actions-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gridColumn: '1 / -1' }}>
        <button className="btn-primary" onClick={handleExportPDF}>
          <Download size={18} />
          Exportar PDF
        </button>
      </div>
      
      <div id="dashboard-report-content" className="dashboard-report-wrapper" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Mini KPIs */}
        <div className="dash-panel" style={{ gridColumn: 'span 12', flexDirection: 'row', gap: '2rem', padding: '1rem 1.5rem', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total de Tarefas</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTasks}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>Concluídas</div>
          <div style={{ color: 'var(--color-success)', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalCompleted}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>Horas Totais</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalHours}h</div>
        </div>
      </div>

      <div className="dash-panel" style={{ gridColumn: 'span 4' }}>
        <h3 className="dash-panel-title">
          <PieChart size={20} className="highlight" style={{color: 'var(--accent-primary)'}} />
          Participação (em horas)
        </h3>
        <div className="chart-container" style={{height: '300px'}}>
          {totalCompleted > 0 ? (
            <Doughnut data={participationData} options={doughnutOptions} />
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Nenhuma tarefa concluída no filtro atual.</div>
          )}
        </div>
      </div>

      <div className="dash-panel" style={{ gridColumn: 'span 8' }}>
        <h3 className="dash-panel-title">
          <BarChart3 size={20} className="highlight" style={{color: '#3b82f6'}} />
          Contribuição de Cada Integrante (em horas)
        </h3>
        <div className="chart-container" style={{height: '300px'}}>
           <Bar data={contributionData} options={barOptions} />
        </div>
      </div>

      <div className="dash-panel" style={{ gridColumn: 'span 12' }}>
        <h3 className="dash-panel-title">
          <Clock size={20} className="highlight" style={{color: 'var(--color-warning)'}} />
          Relatório de Horas por Matéria
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="hours-table">
            <thead>
              <tr>
                <th>Matéria</th>
                <th>Membros (Horas)</th>
                <th style={{textAlign: 'right'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {hoursReportData.length > 0 ? (
                hoursReportData.map(([subject, data]) => (
                  <tr key={subject}>
                    <td style={{ fontWeight: 500 }}>{subject}</td>
                    <td>
                      {Object.entries(data.byUser).map(([userId, hours]) => (
                        <span key={userId} style={{ display: 'inline-block', marginRight: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {getUserName(userId)}: <strong style={{color: 'var(--text-primary)'}}>{hours}h</strong>
                        </span>
                      ))}
                    </td>
                    <td style={{textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)'}}>{data.total}h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Nenhuma hora registrada com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dash-panel" style={{ gridColumn: 'span 12' }}>
        <h3 className="dash-panel-title">
          <ListIcon size={20} className="highlight" style={{color: 'var(--color-success)'}} />
          Lista de Tarefas
        </h3>
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table className="hours-table" style={{width: '100%'}}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface-elevated)', zIndex: 1 }}>
              <tr>
                <th style={{textAlign: 'left'}}>Título</th>
                <th style={{textAlign: 'left'}}>Matéria</th>
                <th style={{textAlign: 'left'}}>Responsável</th>
                <th style={{textAlign: 'left'}}>Status</th>
                <th style={{textAlign: 'right'}}>Horas</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{task.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{task.subject}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{getUserName(task.assigneeId)}</td>
                    <td >
                       <span style={{
                         display: 'inline-block',
                         padding: '2px 8px',
                         borderRadius: '12px',
                         fontSize: '0.75rem',
                         background: 'var(--bg-card)',
                         border: '1px solid var(--glass-border)'
                       }}>{task.status}</span>
                    </td>
                    <td style={{textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)'}}>{task.hoursSpent || 0}h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Nenhuma tarefa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      </div> {/* fim do dashboard-report-content */}
    </div>
  );
};

export default DashboardView;
