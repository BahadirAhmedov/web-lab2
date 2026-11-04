const STORAGE_KEY = 'todo-app.tasks';

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.date === 'string' &&
    typeof task.completed === 'boolean'
  );
}

/**
 * Хранилище задач. Порядок элементов массива — пользовательский порядок задач.
 * @typedef {{ id: string, title: string, date: string, completed: boolean, createdAt: number }} Task
 */
export class TaskStore {
  constructor() {
    /** @type {Task[]} */
    this.tasks = [];
  }

  /** Восстанавливает задачи из localStorage. */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      this.tasks = Array.isArray(parsed) ? parsed.filter(isValidTask) : [];
    } catch (error) {
      console.warn('Не удалось загрузить задачи из localStorage', error);
      this.tasks = [];
    }
  }

  /** Сохраняет задачи в localStorage. */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.warn('Не удалось сохранить задачи в localStorage', error);
    }
  }

  add(title, date) {
    const task = {
      id: generateId(),
      title: title.trim(),
      date,
      completed: false,
      createdAt: Date.now(),
    };
    this.tasks.unshift(task);
    this.save();
    return task;
  }

  remove(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }

  toggle(id) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.save();
  }

  update(id, { title, date }) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) return;
    task.title = title.trim();
    task.date = date;
    this.save();
  }

  /** Перемещает задачу draggedId перед (или после) задачи targetId. */
  move(draggedId, targetId, after = false) {
    const from = this.tasks.findIndex((task) => task.id === draggedId);
    if (from === -1 || draggedId === targetId) return;

    const [task] = this.tasks.splice(from, 1);
    const targetIndex = this.tasks.findIndex((item) => item.id === targetId);
    if (targetIndex === -1) {
      this.tasks.splice(from, 0, task);
      return;
    }

    this.tasks.splice(after ? targetIndex + 1 : targetIndex, 0, task);
    this.save();
  }
}
