export function createElement(tag, options = {}, children = []) {
  const element = document.createElement(tag);
  const { className, text, attrs, dataset, on } = options;

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (value === false || value === null || value === undefined) continue;
      element.setAttribute(name, value === true ? '' : value);
    }
  }

  if (dataset) Object.assign(element.dataset, dataset);

  if (on) {
    for (const [event, handler] of Object.entries(on)) {
      element.addEventListener(event, handler);
    }
  }

  element.append(...children);
  return element;
}

export function setupHead() {
  document.title = 'ToDo — список задач';

  const viewport = createElement('meta', {
    attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  });
  const description = createElement('meta', {
    attrs: { name: 'description', content: 'ToDo-лист на чистом JavaScript' },
  });
  const icon = createElement('link', {
    attrs: {
      rel: 'icon',
      href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✅</text></svg>",
    },
  });
  const styles = createElement('link', {
    attrs: { rel: 'stylesheet', href: 'css/style.css' },
  });

  document.head.append(viewport, description, icon, styles);
}
