// Access values passed through the window object. This way we can expose values from the backend
// and share them with frontend.

function getValue(key) {
  if (!window) {
    throw new Error('Window object is not available!');
  }
  if (!'assistant' in window || typeof window.assistant !== 'object') {
    throw new Error('There is no assistant object attached to window!')
  }
  if (!key in window.assistant) {
    throw new Error('They value "' + key + '" is not available in window.assistant');
  }

  return window.assistant[key];
}

export function getBaseUrl() {
  return getValue('baseUrl');
}

export function getApplicationId() {
  return getValue('applicationId');
}

export function getGoogleClientId() {
  return getValue('googleClientId');
}
