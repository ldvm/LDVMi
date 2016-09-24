import { Map, fromJS, Set, Collection } from 'immutable'
import languages from '../../../misc/languages'

export const NOLANG = 'nolang';

// There is a little confusion with what the "localized value" is. In the broadest sense it means
// a value that potentially holds the same information available in different languages but
// it can just as well be a simple string. Following function make no assumptions about the input
// format and should be smart enough to extract the required information.

/**
 * Attempts to extract value in required language. If value for given language is not available, the
 * function returns any value that is available. For example, if the localizedValue itself is a
 * string, this string is returned. If there is no value available at all, defaultValue
 * is returned.
 *
 * @param {string} lang code of the required language
 * @param {*} localizedValue can be anything, the function will parse it and if it recognizes
 *  familiar format (object or Immutable.Map with "variants" property) it will attempt to extract
 *  value in required language.
 * @param {string} defaultValue function will fallback to this value if no other value is available
 * @returns {string} extracted value
 */
export function extractFromLocalizedValue(lang, localizedValue, defaultValue = null) {

  if (localizedValue === undefined || localizedValue === null) {
    return defaultValue;
  }

  if (localizedValue instanceof Map && localizedValue.has('variants')) {
    if (localizedValue.get('variants').has(lang)) {
      return localizedValue.get('variants').get(lang);
    } else if (localizedValue.get('variants').has(NOLANG)) {
      return localizedValue.get('variants').get(NOLANG);
    } else if (localizedValue.get('variants').size > 0) {
      return localizedValue.get('variants').first();
    } else {
      return defaultValue;
    }
  } else if (localizedValue.variants) {
    if (lang in localizedValue.variants) {
      return localizedValue.variants[lang];
    } else if (NOLANG in localizedValue.variants) {
      return localizedValue.variants[NOLANG];
    } else if (Object.keys(localizedValue.variants).length > 0) {
      return localizedValue.variants[Object.keys(localizedValue.variants)[0]];
    } else {
      return defaultValue;
    }
  } else if (localizedValue instanceof String || typeof localizedValue == "string") {
    return localizedValue + '';
  } else {
    return defaultValue;
  }
}

/**
 * Returns localized value in standardized format. The standardized format means an instance
 * of Immutable.Map with the "variants" property. 
 * @param {*} value in any format
 * @returns {Map} normalized value
 */
export function normalizeLocalizedValue(value) {
  const normalizedEmpty = fromJS({ variants: {} });

  if (value === undefined || value === null) {
    return normalizedEmpty;
  } else if (value instanceof Map && value.has('variants')) {
    return value;
  } else if (value.variants) {
    return fromJS({ variants: value.variants });
  } else if (value instanceof String || typeof value == "string") {
    return fromJS({ variants: { [NOLANG]: value }});
  } else {
    return normalizedEmpty;
  }
}

/**
 * Returns if there is any value to be displayed
 * @param {*} value
 * @return {boolean}
 */
export function isLocalizedValueEmpty(value) {
  return normalizeLocalizedValue(value).get('variants').size === 0;
}

/**
 * Recursively searches through the value and extracts available languages. It's looking for
 * objects or Immutable.Maps with the "variants" property. It returns a Set of all discovered
 * valid languages.
 * @param {*} value
 * @return {Set}
 */
export function extractLanguages(value) {
  if (value === undefined || value === null) {
    return new Set();
  } else if (value instanceof Collection.Keyed) {
    if (value.has('variants')) {
      return new Set(value.get('variants').keySeq().filter(lang => lang in languages));
    } else {
      return value.valueSeq().reduce((langs, v) => langs.merge(extractLanguages(v)), new Set());
    }
  } else if (value instanceof Collection.Indexed) {
    return value.reduce((langs, val) => langs.merge(extractLanguages(val)), new Set());
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    if ('variants' in value) {
      return new Set(Object.keys(value.variants).filter(lang => lang in languages));
    } else {
      return Object.keys(value).reduce((langs, k) => langs.merge(extractLanguages(value[k])), new Set());
    }
  } else if (Array.isArray(value)) {
    return value.reduce((langs, v) => langs.merge(extractLanguages(v)), new Set());
  } else {
    return new Set();
  }
}

/**
 * Return preferred language in the browser environment.
 * @returns {string} language code
 */
export function getBrowserPreferredLanguage() {
  return (window.navigator && window.navigator.language) || 'en';
}
