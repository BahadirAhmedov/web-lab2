const STATUS_FILTERS = {
  all: () => true,
  active: (task) => !task.completed,
  completed: (task) => task.completed,
};

function compareByDate(a, b) {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date.localeCompare(b.date);
}

const SORTERS = {
  'date-asc': compareByDate,
  'date-desc': (a, b) => {
    if (!a.date || !b.date) return compareByDate(a, b);
    return b.date.localeCompare(a.date);
  },
};

export function getVisibleTasks(tasks, { filter = 'all', search = '', sort = 'manual' } = {}) {
  const byStatus = STATUS_FILTERS[filter] ?? STATUS_FILTERS.all;
  const query = search.trim().toLowerCase();

  const visible = tasks.filter((task) => byStatus(task) && task.title.toLowerCase().includes(query));

  const sorter = SORTERS[sort];
  return sorter ? visible.sort(sorter) : visible;
}
