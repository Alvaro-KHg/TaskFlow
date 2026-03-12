import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { USERS, SUBJECTS, STATUSES, PRIORITIES, TAGS, TASK_TYPES } from '../data/mockData';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { isToday, isTomorrow, isThisWeek, isBefore, startOfDay } from 'date-fns';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState([]);

  // Busca dados na Nuvem
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const { data: tasksData, error: tErr } = await supabase.from('tasks').select('*');
        if (tErr) throw tErr;
        if (tasksData) setTasks(tasksData);

        const { data: linksData, error: lErr } = await supabase.from('links').select('*');
        if (lErr) throw lErr;
        if (linksData) setLinks(linksData);
      } catch (err) {
        console.error('Erro buscando Supabase:', err);
      }
    };
    fetchDados();
  }, []);
  
  // Filtros Globais
  const [filters, setFilters] = useState({
    assignee: '',
    subject: '',
    status: '',
    priority: '',
    timeframe: '',
    search: ''
  });

  // Derived state: tarefas filtradas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchAssignee = filters.assignee ? task.assigneeId === filters.assignee : true;
      const matchSubject = filters.subject ? task.subject === filters.subject : true;
      const matchStatus = filters.status ? task.status === filters.status : true;
      const matchPriority = filters.priority ? task.priority === filters.priority : true;
      const matchSearch = filters.search 
        ? task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
          task.description.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      // Filtro de Data Pre-definido
      let matchTimeframe = true;
      if (filters.timeframe && task.dueDate) {
        const tDate = new Date(task.dueDate);
        const todayStart = startOfDay(new Date());
        
        if (filters.timeframe === 'hoje') matchTimeframe = isToday(tDate);
        else if (filters.timeframe === 'amanha') matchTimeframe = isTomorrow(tDate);
        else if (filters.timeframe === 'esta_semana') matchTimeframe = isThisWeek(tDate, { weekStartsOn: 0 });
        else if (filters.timeframe === 'atrasadas') matchTimeframe = isBefore(tDate, todayStart) && task.status !== 'Concluído';
      }

      return matchAssignee && matchSubject && matchStatus && matchPriority && matchSearch && matchTimeframe;
    });
  }, [tasks, filters]);

  // Derived state: Dynamic Subjects & Tags based on DB content
  const dynamicSubjects = useMemo(() => {
    const dbSubjects = tasks.map(t => t.subject).filter(s => s && s.trim() !== '' && s !== 'mode');
    return Array.from(new Set([...SUBJECTS, ...dbSubjects]));
  }, [tasks]);

  const dynamicTags = useMemo(() => {
    const dbTags = tasks.flatMap(t => t.tags || []).filter(t => t && t.trim() !== '' && t !== 'mode');
    return Array.from(new Set([...TAGS, ...dbTags]));
  }, [tasks]);

  // Actions
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      assignee: '',
      subject: '',
      status: '',
      priority: '',
      timeframe: '',
      search: ''
    });
  };

  const addTask = async (newTask) => {
    const { id, ...dataToInsert } = newTask; // Ignora ID local
    const { data, error } = await supabase.from('tasks').insert([dataToInsert]).select();
    if (error) {
      console.error(error); 
      toast.error('Erro ao adicionar tarefa.');
      return;
    }
    if (data) {
      setTasks(prev => [...prev, data[0]]);
      toast.success('Tarefa criada com sucesso!');
    }
  };

  const updateTask = async (id, updatedFields) => {
    // Atualização Otimista no frontend
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedFields } : task));
    const { error } = await supabase.from('tasks').update(updatedFields).eq('id', id);
    if (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao atualizar.');
    } else {
      toast.success('Alterações salvas!');
    }
  };

  const deleteTask = async (id) => {
    // Atualização Otimista no frontend
    setTasks(prev => prev.filter(task => task.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error(error);
      toast.error('Falha ao excluir.');
    } else {
      toast.success('Tarefa removida.', { icon: '🗑️' });
    }
  };

  // Mover tarefa entre colunas (usado no Kanban)
  const moveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // Funções para Links
  const addLink = async (newLink) => {
    const { id, ...linkData } = newLink;
    const { data, error } = await supabase.from('links').insert([linkData]).select();
    if (error) {
       console.error(error); 
       toast.error('Erro ao adicionar Link.');
       return;
    }
    if (data) {
      setLinks(prev => [...prev, data[0]]);
      toast.success('Link fixado no mural!');
    }
  };

  const deleteLink = async (id) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (error) {
      console.error(error);
      toast.error('Erro ao excluir link.');
    } else {
      toast.success('Link deletado.', { icon: '🗑️' });
    }
  };

  const value = {
    tasks,
    filteredTasks,
    filters,
    updateFilter,
    clearFilters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    links,
    addLink,
    deleteLink,
    // Estático e Dinâmico
    users: USERS,
    subjects: dynamicSubjects,
    statuses: STATUSES,
    priorities: PRIORITIES,
    taskTypes: TASK_TYPES,
    tags: dynamicTags
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
