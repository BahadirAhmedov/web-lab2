const DRAGGING_CLASS = 'task--dragging';
const DROP_BEFORE_CLASS = 'task--drop-before';
const DROP_AFTER_CLASS = 'task--drop-after';

function clearDropMarkers(list) {
  list.querySelectorAll(`.${DROP_BEFORE_CLASS}, .${DROP_AFTER_CLASS}`).forEach((item) => {
    item.classList.remove(DROP_BEFORE_CLASS, DROP_AFTER_CLASS);
  });
}

/** Определяет, куда вставлять задачу: перед целевой или после неё. */
function isAfter(target, clientY) {
  const rect = target.getBoundingClientRect();
  return clientY > rect.top + rect.height / 2;
}

/**
 * Подключает перетаскивание задач (HTML Drag and Drop API) к списку.
 * @param {HTMLElement} list
 * @param {(draggedId: string, targetId: string, after: boolean) => void} onMove
 */
export function setupDragAndDrop(list, onMove) {
  let draggedId = null;

  list.addEventListener('dragstart', (event) => {
    const item = event.target.closest('.task[draggable="true"]');
    if (!item) return;

    draggedId = item.dataset.id;
    item.classList.add(DRAGGING_CLASS);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedId);
  });

  list.addEventListener('dragover', (event) => {
    if (!draggedId) return;

    const target = event.target.closest('.task');
    if (!target || target.dataset.id === draggedId) {
      clearDropMarkers(list);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const after = isAfter(target, event.clientY);
    clearDropMarkers(list);
    target.classList.add(after ? DROP_AFTER_CLASS : DROP_BEFORE_CLASS);
  });

  list.addEventListener('dragleave', (event) => {
    if (!list.contains(event.relatedTarget)) clearDropMarkers(list);
  });

  list.addEventListener('drop', (event) => {
    event.preventDefault();

    const target = event.target.closest('.task');
    const sourceId = draggedId;
    clearDropMarkers(list);

    if (!sourceId || !target || target.dataset.id === sourceId) return;
    onMove(sourceId, target.dataset.id, isAfter(target, event.clientY));
  });

  list.addEventListener('dragend', () => {
    draggedId = null;
    clearDropMarkers(list);
    list.querySelectorAll(`.${DRAGGING_CLASS}`).forEach((item) => item.classList.remove(DRAGGING_CLASS));
  });

  setupTouchDrag(list, onMove);
}

/**
 * На сенсорных экранах HTML Drag and Drop работает не везде,
 * поэтому для touch перетаскивание реализовано через Pointer Events за «ручку».
 */
function setupTouchDrag(list, onMove) {
  let source = null;
  let drop = null;

  const finish = () => {
    if (source) source.classList.remove(DRAGGING_CLASS);
    clearDropMarkers(list);
    source = null;
    drop = null;
  };

  list.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;

    const handle = event.target.closest('.task__handle');
    const item = handle && handle.closest('.task[draggable="true"]');
    if (!item) return;

    event.preventDefault();
    source = item;
    source.classList.add(DRAGGING_CLASS);
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // Указатель уже неактивен — продолжаем без захвата
    }
  });

  list.addEventListener('pointermove', (event) => {
    if (!source) return;

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.task');
    clearDropMarkers(list);

    if (!target || target === source || !list.contains(target)) {
      drop = null;
      return;
    }

    const after = isAfter(target, event.clientY);
    target.classList.add(after ? DROP_AFTER_CLASS : DROP_BEFORE_CLASS);
    drop = { targetId: target.dataset.id, after };
  });

  list.addEventListener('pointerup', () => {
    if (!source) return;

    const sourceId = source.dataset.id;
    const target = drop;
    finish();

    if (target) onMove(sourceId, target.targetId, target.after);
  });

  list.addEventListener('pointercancel', finish);
}
