import { Map } from 'immutable'

// TODO: store somewhere current language
const LANG = 'cs';
const NOLANG = 'nolang';

/** Extracts label in correct language mutation */
export function _label(l) {
  if (l instanceof Map && l.has('variants')) {
    if (l.get('variants').has(LANG)) {
      return l.get('variants').get(LANG);
    } else if (l.get('variants').has(NOLANG)) {
      return l.get('variants').get(NOLANG);
    } else {
      return false;
    }
  } else if (l.variants) {
    if (LANG in l.variants) {
      return l.variants[LANG];
    } else if (NOLANG in l.variants) {
      return l.variants[NOLANG];
    } else {
      return false;
    }
  } else if (l instanceof String || typeof l == "string") {
    return l + '';
  } else {
    return false;
  }
}
