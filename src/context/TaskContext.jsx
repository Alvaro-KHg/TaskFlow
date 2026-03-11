import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { USERS, SUBJECTS, STATUSES, PRIORITIES, TAGS, TASK_TYPES } from '../data/mockData';
import { supabase } from '../lib/supabase';

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

      return matchAssignee && matchSubject && matchStatus && matchPriority && matchSearch;
    });
  }, [tasks, filters]);

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
      search: ''
    });
  };

  const addTask = async (newTask) => {
    const { id, ...dataToInsert } = newTask; // Ignora ID local
    const { data, error } = await supabase.from('tasks').insert([dataToInsert]).select();
    if (error) {
      console.error(error); 
      return;
    }
    if (data) setTasks(prev => [...prev, data[0]]);
  };

  const updateTask = async (id, updatedFields) => {
    // Atualização Otimista no frontend
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedFields } : task));
    const { error } = await supabase.from('tasks').update(updatedFields).eq('id', id);
    if (error) console.error(error);
  };

  const deleteTask = async (id) => {
    // Atualização Otimista no frontend
    setTasks(prev => prev.filter(task => task.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error(error);
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
       console.error(error); return;
    }
    if (data) setLinks(prev => [...prev, data[0]]);
  };

  const deleteLink = async (id) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (error) console.error(error);
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
    // Estático
    users: USERS,
    subjects: SUBJECTS,
    statuses: STATUSES,
    priorities: PRIORITIES,
    taskTypes: TASK_TYPES,
    tags: TAGS
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
