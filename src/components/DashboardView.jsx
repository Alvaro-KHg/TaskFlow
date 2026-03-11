import React, { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, Clock, Hash } from 'lucide-react';
import './DashboardView.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardView = () => {
  const { filteredTasks, users, subjects } = useTaskContext();

  // 1. Gráfico de Participação (Tarefas concluídas por membro)
  const participationData = useMemo(() => {
    const completedTasks = filteredTasks.filter(t => t.status === 'Concluído');
    
    const countByUser = {};
    users.forEach(u => countByUser[u.id] = 0);
    completedTasks.forEach(t => {
      if (t.assigneeId) countByUser[t.assigneeId] += 1;
    });

    const labels = users.map(u => {
      const count = countByUser[u.id];
      const perc = completedTasks.length > 0 ? Math.round((count / completedTasks.length) * 100) : 0;
      return `${u.name.split(' ')[0]} (${perc}%)`;
    });
    const data = users.map(u => countByUser[u.id]);
    
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#f8fafc', font: { family: 'Inter' } } },
      tooltip: { theme: 'dark' }
    },
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

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Mini KPIs */}
      <div className="dash-panel" style={{ gridColumn: '1 / -1', flexDirection: 'row', gap: '2rem', padding: '1rem 1.5rem', justifyContent: 'space-around' }}>
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

      <div className="dash-panel">
        <h3 className="dash-panel-title">
          <PieChart size={20} className="highlight" style={{color: 'var(--accent-primary)'}} />
          Participação (Tarefas Concluídas)
        </h3>
        <div className="chart-container">
          {totalCompleted > 0 ? (
            <Doughnut data={participationData} options={doughnutOptions} />
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Nenhuma tarefa concluída no filtro atual.</div>
          )}
        </div>
      </div>

      <div className="dash-panel">
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
    </div>
  );
};

export default DashboardView;
