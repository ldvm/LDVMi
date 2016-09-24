import revalidator from 'revalidator'

/** Creates validator function for redux-form using revalidator scheme */
export function makeValidator(scheme) {
  // An empty form is returning undefined values which are being accepted because 'allowEmpty'
  // rule covers only empty strings.
  for (let property in scheme.properties) {
    if (scheme.properties[property].allowEmpty === false) {
      scheme.properties[property].required = true;
    }
  }

  return (values) => {
    let errors = {};

    // Convert revalidator error format into redux form format
    revalidator.validate(values, scheme).errors.forEach(error => {
      errors[error.property] = error.message
    });
    return errors;
  }
}

/** Add error text property to Material text field with current error message */
export function errorText(field) {
  return field.touched && field.error ? { errorText: field.error } : {};
}

/**
 * Add error text property to Material text field with current error message if
 * (1) The form has been submitted
 * (2) The form failed
 * (3) The form faild on this field
 */
export function errorTextFactory(submitFailed) {
  return (field) => submitFailed && field.error ? {errorText: field.error} : {};
}