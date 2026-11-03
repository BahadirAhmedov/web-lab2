import { setupHead } from './dom.js';
import { buildLayout } from './layout.js';
import { TaskStore } from './store.js';
import { renderTasks, renderStats } from './render.js';

setupHead();
const ui = buildLayout();
const store = new TaskStore();
store.load();

const state = {
  editingId: null,
};

function render() {
  renderTasks(ui, store.tasks, { editingId: state.editingId });
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

render();
