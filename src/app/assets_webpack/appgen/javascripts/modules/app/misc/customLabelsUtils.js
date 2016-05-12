import { Map } from 'immutable'
import languages from '../../../misc/languages'
import { normalizeLocalizedValue } from './languageUtils'

/** Validates the custom labels form */
export function validateForm(values) {
  const usedLanguages = values.variants.map(variant => variant.lang);

  return {
    variants: values.variants.map(variant => {
      const errors = {};

      if (!variant.label) {
        errors.label = 'Label must not be empty';
      }

      if (!variant.lang) {
        errors.lang = 'Required';
      } else if (!(variant.lang in languages)) {
        errors.lang = 'Invalid language';
      } else if (usedLanguages.filter(lang => lang == variant.lang).length > 1) {
        errors.lang = 'Already used'
      }

      return errors;
    })
  }
}

export function applyCustomLabel(uri, label, customLabels) {
  const customLabel = customLabels.get(uri) || new Map();
  return normalizeLocalizedValue(label).mergeDeep(customLabel);
}

