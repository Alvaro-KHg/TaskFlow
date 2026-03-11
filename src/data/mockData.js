import { addDays, subDays } from 'date-fns';

export const USERS = [
  { id: 'u1', name: 'Alvaro', avatar: '/avatars/red.png' }, // Ranger Vermelho
  { id: 'u2', name: 'Bruno', avatar: '/avatars/blue.png' }, // Ranger Azul
  { id: 'u3', name: 'Fernando', avatar: '/avatars/green.png' }, // Ranger Verde
  { id: 'u4', name: 'Kaique', avatar: '/avatars/black.png' }, // Ranger Preto
  { id: 'u5', name: 'Borges', avatar: '/avatars/yellow.png' }, // Ranger Amarelo
  { id: 'u6', name: 'Rafaela', avatar: '/avatars/pink.png' }, // Ranger Rosa
];

export const SUBJECTS = [
  'Captura de Dados na Web',
  'Modelagem Matemática e Otimização',
  'Data Warehouse',
  'Projeto Integrador',
  'Imagem Digital',
  'Recuperação de Informação',
  'Artigo Revista'
];

export const STATUSES = ['A Fazer', 'Em Andamento', 'Bloqueado/Aguardando', 'Revisão', 'Concluído'];

export const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica'];

export const TASK_TYPES = ['Individual', 'Em Grupo'];

export const TAGS = ['Trabalho Final', 'Lista de Exercícios', 'Pesquisa', 'Apresentação', 'Projeto Prático', 'Leitura'];

const now = new Date();

export const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Scraping de Dados',
    description: 'Criar script Python para extrair dados do portal público.',
    subject: 'Captura de Dados na Web',
    dueDate: addDays(now, 2).toISOString(),
    assigneeId: 'u1',
    status: 'Em Andamento',
    priority: 'Alta',
    taskType: 'Individual',
    tags: ['Projeto Prático'],
    hoursSpent: 4,
  },
  {
    id: 't2',
    title: 'Modelagem do Problema de Transporte',
    description: 'Resolver o problema de otimização usando simplex.',
    subject: 'Modelagem Matemática e Otimização',
    dueDate: subDays(now, 1).toISOString(),
    assigneeId: 'u2',
    status: 'Concluído',
    priority: 'Média',
    taskType: 'Individual',
    tags: ['Lista de Exercícios'],
    hoursSpent: 3,
  },
  {
    id: 't3',
    title: 'Estruturação Star Schema',
    description: 'Criar o modelo multidimensional para as vendas.',
    subject: 'Data Warehouse',
    dueDate: addDays(now, 5).toISOString(),
    assigneeId: 'u3',
    status: 'Bloqueado/Aguardando',
    priority: 'Crítica',
    taskType: 'Em Grupo',
    tags: ['Projeto Prático'],
    hoursSpent: 0,
  },
  {
    id: 't4',
    title: 'Especificação de Requisitos',
    description: 'Levantamento de requisitos do PI.',
    subject: 'Projeto Integrador',
    dueDate: addDays(now, 1).toISOString(),
    assigneeId: 'u4',
    status: 'Revisão',
    priority: 'Média',
    taskType: 'Em Grupo',
    tags: ['Trabalho Final'],
    hoursSpent: 6,
  },
  {
    id: 't5',
    title: 'Filtros de Convolução',
    description: 'Aplicar filtros de Sobel e Canny nas imagens de teste.',
    subject: 'Imagem Digital',
    dueDate: addDays(now, 7).toISOString(),
    assigneeId: 'u5',
    status: 'A Fazer',
    priority: 'Baixa',
    taskType: 'Individual',
    tags: ['Pesquisa'],
    hoursSpent: 0,
  },
  {
    id: 't6',
    title: 'Implementar TF-IDF',
    description: 'Criar o índice invertido e calcular TF-IDF.',
    subject: 'Recuperação de Informação',
    dueDate: addDays(now, 3).toISOString(),
    assigneeId: 'u6',
    status: 'Em Andamento',
    priority: 'Alta',
    taskType: 'Em Grupo',
    tags: ['Apresentação'],
    hoursSpent: 5,
  },
  {
    id: 't7',
    title: 'Revisão Bibliográfica',
    description: 'Ler os 10 artigos base e fazer o fichamento.',
    subject: 'Artigo Revista',
    dueDate: addDays(now, 10).toISOString(),
    assigneeId: 'u1',
    status: 'A Fazer',
    priority: 'Média',
    taskType: 'Individual',
    tags: ['Leitura'],
    hoursSpent: 0,
  }
];

export const INITIAL_LINKS = [
  { id: 'l1', title: 'Repositório do Projeto Integrador', url: 'https://github.com/' },
  { id: 'l2', title: 'Drive com os Artigos', url: 'https://drive.google.com/' },
  { id: 'l3', title: 'Mural da Disciplina de Otimização', url: 'https://classroom.google.com/' }
];
