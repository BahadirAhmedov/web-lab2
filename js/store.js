function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
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

  add(title, date) {
    const task = {
      id: generateId(),
      title: title.trim(),
      date,
      completed: false,
      createdAt: Date.now(),
    };
    this.tasks.unshift(task);
    return task;
  }

  remove(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  toggle(id) {
    const task = this.tasks.find((item) => item.id === id);
    if (task) task.completed = !task.completed;
  }
}
