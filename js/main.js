import { setupHead } from './dom.js';
import { buildLayout } from './layout.js';
import { TaskStore } from './store.js';
import { renderTasks, renderStats } from './render.js';
import { getVisibleTasks } from './filters.js';

setupHead();
const ui = buildLayout();
const store = new TaskStore();
store.load();

const state = {
  editingId: null,
  filter: 'all',
  search: '',
};

function render() {
  const visibleTasks = getVisibleTasks(store.tasks, state);
  renderTasks(ui, visibleTasks, { editingId: state.editingId, hasTasks: store.tasks.length > 0 });
  renderStats(ui, store.tasks);
}

ui.form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = ui.titleInput.value.trim();
  if (!title) {
    ui.titleInput.classList.add('field__input--invalid');
    ui.titleInput.focus();
    return;
  }

  store.add(title, ui.dateInput.value);
  ui.form.reset();
  ui.titleInput.focus();
  render();
});

ui.titleInput.addEventListener('input', () => {
  ui.titleInput.classList.remove('field__input--invalid');
});

ui.searchInput.addEventListener('input', () => {
  state.search = ui.searchInput.value;
  render();
});

ui.filterSelect.addEventListener('change', () => {
  state.filter = ui.filterSelect.value;
  render();
});

ui.list.addEventListener('change', (event) => {
  if (event.target.dataset.action !== 'toggle') return;

  const { id } = event.target.closest('.task').dataset;
  store.toggle(id);
  render();
});

ui.list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const item = button.closest('.task');
  const { id } = item.dataset;

  switch (button.dataset.action) {
    case 'delete':
      if (state.editingId === id) state.editingId = null;
      store.remove(id);
      break;
    case 'edit':
      state.editingId = id;
      break;
    case 'cancel':
      state.editingId = null;
      break;
    default:
      return;
  }

  render();
});

ui.list.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.target;
  const { id } = form.closest('.task').dataset;
  const titleInput = form.elements.title;
  const title = titleInput.value.trim();

  if (!title) {
    titleInput.classList.add('field__input--invalid');
    titleInput.focus();
    return;
  }

  store.update(id, { title, date: form.elements.date.value });
  state.editingId = null;
  render();
});

ui.list.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.editingId) {
    state.editingId = null;
    render();
  }
});

ui.list.addEventListener('input', (event) => {
  event.target.classList.remove('field__input--invalid');
});

render();
