import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import makePureRender from '../../../misc/makePureRender'
import { langSelector } from '../ducks/lang'
import { extractLocalizedValue } from '../misc/languageUtils'

const LocalizedValue = ({ lang, value, defaultValue, silent }) => {
  const extracted = extractLocalizedValue(lang, value, defaultValue);
  return <span>{extracted || (silent ? '' : '(missing value)')}</span>;
};

LocalizedValue.propTypes = {
  lang: PropTypes.string.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.string,
  silent: PropTypes.bool
};

const selector = createStructuredSelector({
  lang: langSelector
});

export default connect(selector)(makePureRender(LocalizedValue));
