import { createElement } from './dom.js';

/** Превращает строку YYYY-MM-DD в локальную дату без сдвига часового пояса. */
export function parseDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return 'Без срока';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isOverdue(task) {
  const date = parseDate(task.date);
  if (!date || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function createTaskItem(task) {
  const classes = ['task'];
  if (task.completed) classes.push('task--done');
  if (isOverdue(task)) classes.push('task--overdue');

  const checkbox = createElement('input', {
    className: 'task__checkbox',
    attrs: {
      type: 'checkbox',
      checked: task.completed,
      'aria-label': `Отметить задачу «${task.title}» как выполненную`,
    },
    dataset: { action: 'toggle' },
  });

  const time = createElement('time', {
    className: 'task__date',
    text: formatDate(task.date),
    attrs: task.date ? { datetime: task.date } : {},
  });

  const content = createElement('div', { className: 'task__content' }, [
    createElement('p', { className: 'task__title', text: task.title }),
    time,
  ]);

  const deleteButton = createElement('button', {
    className: 'icon-button icon-button--danger',
    text: '✕',
    attrs: { type: 'button', title: 'Удалить', 'aria-label': `Удалить задачу «${task.title}»` },
    dataset: { action: 'delete' },
  });

  const actions = createElement('div', { className: 'task__actions' }, [deleteButton]);

  return createElement('li', { className: classes.join(' '), dataset: { id: task.id } }, [
    createElement('article', { className: 'task__body' }, [checkbox, content, actions]),
  ]);
}

/** Перерисовывает список задач. */
export function renderTasks(ui, tasks) {
  const items = tasks.map((task) => createTaskItem(task));
  ui.list.replaceChildren(...items);
  ui.emptyMessage.hidden = tasks.length > 0;
}

/** Обновляет счётчики в подвале. */
export function renderStats(ui, allTasks) {
  const done = allTasks.filter((task) => task.completed).length;
  ui.stats.textContent = `Всего задач: ${allTasks.length} · выполнено: ${done} · осталось: ${allTasks.length - done}`;
}
