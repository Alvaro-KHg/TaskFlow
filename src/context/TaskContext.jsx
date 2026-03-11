import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_TASKS, USERS, SUBJECTS, STATUSES, PRIORITIES, TAGS, TASK_TYPES, INITIAL_LINKS } from '../data/mockData';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [links, setLinks] = useState(INITIAL_LINKS);
  
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

  const addTask = (newTask) => {
    setTasks(prev => [...prev, { ...newTask, id: `t${Date.now()}` }]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedFields } : task));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Mover tarefa entre colunas (usado no Kanban)
  const moveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // Funções para Links
  const addLink = (newLink) => {
    setLinks(prev => [...prev, { ...newLink, id: `l${Date.now()}` }]);
  };

  const deleteLink = (id) => {
    setLinks(prev => prev.filter(link => link.id !== id));
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
