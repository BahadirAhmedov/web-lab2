import { setupHead } from './dom.js';
import { buildLayout } from './layout.js';
import { TaskStore } from './store.js';
import { renderTasks, renderStats } from './render.js';

setupHead();
const ui = buildLayout();
const store = new TaskStore();

function render() {
  renderTasks(ui, store.tasks);
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

ui.list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const item = button.closest('.task');
  const { id } = item.dataset;

  if (button.dataset.action === 'delete') {
    store.remove(id);
    render();
  }
});

render();
