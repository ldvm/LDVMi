import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import makePureRender from '../../../misc/makePureRender'
import { langSelector } from '../ducks/lang'

function extractLabel(label, lang) {
  const NOLANG = 'nolang';

  if (label === undefined || label === null) {
    return null;
  }

  if (label instanceof Map && label.has('variants')) {
    if (label.get('variants').has(lang)) {
      return label.get('variants').get(lang);
    } else if (label.get('variants').has(NOLANG)) {
      return label.get('variants').get(NOLANG);
    } else {
      return false;
    }
  } else if (label.variants) {
    if (lang in label.variants) {
      return label.variants[lang];
    } else if (NOLANG in label.variants) {
      return label.variants[NOLANG];
    } else {
      return false;
    }
  } else if (label instanceof String || typeof label == "string") {
    return label + '';
  } else {
    return null;
  }
}
class Label extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uri: PropTypes.string.isRequired,
    label: PropTypes.any.isRequired,
    lang: PropTypes.string.isRequired
  };

  componentDidMount() {
    // TODO: possibly load missing label
  }

  render() {
    const { uri, label, lang } = this.props;
    return <span>{extractLabel(label, lang) || uri}</span>
  }
}

const selector = createSelector(
  [langSelector],
  (lang) => { return { lang }; }
);

export default connect(selector)(makePureRender(Label));
