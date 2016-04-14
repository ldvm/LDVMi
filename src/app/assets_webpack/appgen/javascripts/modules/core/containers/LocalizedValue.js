import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import makePureRender from '../../../misc/makePureRender'
import { langSelector } from '../ducks/lang'

function extract(lang, value, defaultValue = null) {
  const NOLANG = 'nolang';

  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (value instanceof Map && value.has('variants')) {
    if (value.get('variants').has(lang)) {
      return value.get('variants').get(lang);
    } else if (value.get('variants').has(NOLANG)) {
      return value.get('variants').get(NOLANG);
    } else {
      return defaultValue;
    }
  } else if (value.variants) {
    if (lang in value.variants) {
      return value.variants[lang];
    } else if (NOLANG in value.variants) {
      return value.variants[NOLANG];
    } else {
      return defaultValue;
    }
  } else if (value instanceof String || typeof value == "string") {
    return value + '';
  } else {
    return defaultValue;
  }
}

const LocalizedValue = ({ lang, value, defaultValue, silent }) => (
  <span>{extract(lang, value, defaultValue) || (silent ? '' : '(missing value)')}</span>
);

LocalizedValue.propTypes = {
  lang: PropTypes.string.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.string,
  silent: PropTypes.bool
};

const selector = createSelector(
  [langSelector],
  (lang) => { return { lang }; }
);

export default connect(selector)(makePureRender(LocalizedValue));
