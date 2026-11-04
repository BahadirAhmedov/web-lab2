import { createElement } from './dom.js';

function buildHeader() {
  return createElement('header', { className: 'header' }, [
    createElement('h1', { className: 'header__title', text: 'Список задач' }),
    createElement('p', {
      className: 'header__subtitle',
      text: 'Планируйте дела, отмечайте выполненное и не забывайте о сроках',
    }),
  ]);
}

function buildTaskForm() {
  const titleInput = createElement('input', {
    className: 'field__input',
    attrs: {
      type: 'text',
      id: 'task-title',
      name: 'title',
      placeholder: 'Что нужно сделать?',
      maxlength: '120',
      autocomplete: 'off',
      required: true,
    },
  });

  const dateInput = createElement('input', {
    className: 'field__input',
    attrs: { type: 'date', id: 'task-date', name: 'date' },
  });

  const submitButton = createElement('button', {
    className: 'button button--primary',
    text: 'Добавить',
    attrs: { type: 'submit' },
  });

  const form = createElement('form', { className: 'task-form', attrs: { novalidate: true } }, [
    createElement('label', { className: 'field field--grow' }, [
      createElement('span', { className: 'field__label', text: 'Задача' }),
      titleInput,
    ]),
    createElement('label', { className: 'field' }, [
      createElement('span', { className: 'field__label', text: 'Срок' }),
      dateInput,
    ]),
    submitButton,
  ]);

  const section = createElement('section', { className: 'panel', attrs: { 'aria-labelledby': 'form-title' } }, [
    createElement('h2', { className: 'panel__title', text: 'Новая задача', attrs: { id: 'form-title' } }),
    form,
  ]);

  return { section, form, titleInput, dateInput };
}

function buildSelect(id, label, options) {
  const select = createElement(
    'select',
    { className: 'field__input', attrs: { id } },
    options.map(([value, text]) => createElement('option', { text, attrs: { value } })),
  );

  const field = createElement('label', { className: 'field' }, [
    createElement('span', { className: 'field__label', text: label }),
    select,
  ]);

  return { field, select };
}

function buildToolbar() {
  const searchInput = createElement('input', {
    className: 'field__input',
    attrs: {
      type: 'search',
      id: 'task-search',
      placeholder: 'Название задачи…',
      autocomplete: 'off',
    },
  });

  const searchField = createElement('label', { className: 'field toolbar__search' }, [
    createElement('span', { className: 'field__label', text: 'Поиск' }),
    searchInput,
  ]);

  const filter = buildSelect('task-filter', 'Статус', [
    ['all', 'Все задачи'],
    ['active', 'Невыполненные'],
    ['completed', 'Выполненные'],
  ]);

  const sort = buildSelect('task-sort', 'Сортировка', [
    ['manual', 'Свой порядок'],
    ['date-asc', 'Сначала ближайшие'],
    ['date-desc', 'Сначала поздние'],
  ]);

  const section = createElement('section', { className: 'panel toolbar', attrs: { 'aria-label': 'Фильтры задач' } }, [
    searchField,
    filter.field,
    sort.field,
  ]);

  return { section, searchInput, filterSelect: filter.select, sortSelect: sort.select };
}

function buildTaskList() {
  const list = createElement('ul', { className: 'task-list' });
  const emptyMessage = createElement('p', {
    className: 'task-list__empty',
    text: 'Задач пока нет — добавьте первую!',
  });

  const dragHint = createElement('p', {
    className: 'task-list__hint',
    text: 'Чтобы менять порядок перетаскиванием, выберите сортировку «Свой порядок»',
    attrs: { hidden: true },
  });

  const section = createElement('section', { className: 'panel', attrs: { 'aria-labelledby': 'list-title' } }, [
    createElement('h2', { className: 'panel__title', text: 'Мои задачи', attrs: { id: 'list-title' } }),
    dragHint,
    list,
    emptyMessage,
  ]);

  return { section, list, emptyMessage, dragHint };
}

function buildFooter() {
  const stats = createElement('p', { className: 'footer__stats' });
  const footer = createElement('footer', { className: 'footer' }, [stats]);
  return { footer, stats };
}

/**
 * Собирает всю структуру страницы и добавляет её в <body>.
 * Возвращает ссылки на элементы, с которыми работает логика приложения.
 */
export function buildLayout() {
  const header = buildHeader();
  const taskForm = buildTaskForm();
  const toolbar = buildToolbar();
  const taskList = buildTaskList();
  const { footer, stats } = buildFooter();

  const main = createElement('main', { className: 'main' }, [taskForm.section, toolbar.section, taskList.section]);
  const app = createElement('div', { className: 'app' }, [header, main, footer]);

  document.body.append(app);

  return {
    form: taskForm.form,
    titleInput: taskForm.titleInput,
    dateInput: taskForm.dateInput,
    searchInput: toolbar.searchInput,
    filterSelect: toolbar.filterSelect,
    sortSelect: toolbar.sortSelect,
    list: taskList.list,
    emptyMessage: taskList.emptyMessage,
    dragHint: taskList.dragHint,
    stats,
  };
}
