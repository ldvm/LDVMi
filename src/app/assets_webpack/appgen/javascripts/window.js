// Access values passed through the window object

function getValue(key) {
  if (!window) {
    throw new Error('Window object is not available!');
  }
  if (!'appgen' in window || typeof window.appgen !== 'object') {
    throw new Error('There is no appgen object attached to window!')
  }
  if (!key in window.appgen) {
    throw new Error('They value "' + key + '" is not available in window.appgen');
  }

  return window.appgen[key];
}

export function getBaseUrl() {
  return getValue('baseUrl');
}

export function getApplicationId() {
  return getValue('applicationId');
}
