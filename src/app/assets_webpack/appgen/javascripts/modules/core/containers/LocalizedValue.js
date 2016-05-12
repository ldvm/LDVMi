import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import makePureRender from '../../../misc/makePureRender'
import { langSelector } from '../ducks/lang'
import { extractLocalizedValue } from '../misc/languageUtils'

const LocalizedValue = ({ value }) => (
  <span>{value}</span>
);

LocalizedValue.propTypes = {
  value: PropTypes.string.isRequired,
};

const propsSelector = (_, props) => props;

const selector = createSelector(
  [langSelector, propsSelector],
  (lang, { value, defaultValue, silent }) => ({
    value: extractLocalizedValue(lang, value, defaultValue) || (silent ? '' : '(missing value)')
  })
);

// TODO: switch to per instance memoization, this doesn't work
export default connect(selector)(makePureRender(LocalizedValue));
