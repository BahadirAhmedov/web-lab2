const STATUS_FILTERS = {
  all: () => true,
  active: (task) => !task.completed,
  completed: (task) => task.completed,
};

/**
 * Возвращает задачи, которые нужно показать с учётом текущих настроек.
 * Исходный массив не изменяется.
 */
export function getVisibleTasks(tasks, { filter = 'all' } = {}) {
  const byStatus = STATUS_FILTERS[filter] ?? STATUS_FILTERS.all;
  return tasks.filter(byStatus);
}
