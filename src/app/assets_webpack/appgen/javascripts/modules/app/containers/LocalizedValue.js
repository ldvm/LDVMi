import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import makePureRender from '../../../misc/makePureRender'
import { langSelector } from '../ducks/lang'
import { extractFromLocalizedValue } from '../misc/languageUtils'

const LocalizedValue = ({ lang, localizedValue, defaultValue, silent }) => {
  const extracted = extractFromLocalizedValue(lang, localizedValue, defaultValue);
  return <span>{extracted || (silent ? '' : '(missing value)')}</span>;
};

LocalizedValue.propTypes = {
  lang: PropTypes.string.isRequired,
  localizedValue: PropTypes.any,
  defaultValue: PropTypes.string,
  silent: PropTypes.bool
};

const selector = createStructuredSelector({
  lang: langSelector
});

export default connect(selector)(makePureRender(LocalizedValue));
