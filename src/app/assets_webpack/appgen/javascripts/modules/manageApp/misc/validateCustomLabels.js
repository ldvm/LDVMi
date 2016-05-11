import languages from '../../../misc/languages'

/** Validates the custom labels form */
export default function validateCustomLabels(values) {
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

