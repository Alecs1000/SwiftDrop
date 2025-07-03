import { CanvasProject } from './project';

const STORAGE_KEY = 'canvas-projects';

function getAll(): CanvasProject[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CanvasProject[];
  } catch {
    return [];
  }
}

function saveAll(projects: CanvasProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(project: CanvasProject) {
  const projects = getAll();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveAll(projects);
}

export function loadProject(id: string): CanvasProject | undefined {
  return getAll().find(p => p.id === id);
}

export function listProjects(): CanvasProject[] {
  return getAll();
}

export function deleteProject(id: string) {
  const projects = getAll().filter(p => p.id !== id);
  saveAll(projects);
}

export function renameProject(id: string, newTitle: string) {
  const projects = getAll();
  const idx = projects.findIndex(p => p.id === id);
  if (idx >= 0) {
    projects[idx].title = newTitle;
    projects[idx].updatedAt = new Date().toISOString();
    saveAll(projects);
  }
}

export function duplicateProject(id: string): CanvasProject | undefined {
  const project = loadProject(id);
  if (!project) return undefined;
  const newProject = {
    ...project,
    id: crypto.randomUUID(),
    title: project.title + ' (Copy)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProject(newProject);
  return newProject;
}

export function updateProject(id: string, updates: Partial<CanvasProject>) {
  const projects = getAll();
  const idx = projects.findIndex(p => p.id === id);
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
    saveAll(projects);
  }
} 