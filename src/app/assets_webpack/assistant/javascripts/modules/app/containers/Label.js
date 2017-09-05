import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import makePureRender from '../../../misc/makePureRender'
import LocalizedValue from './LocalizedValue'
import { isLocalizedValueEmpty } from '../misc/languageUtils'
import { getLabels, labelsSelector } from '../ducks/labels'

class Label extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uri: PropTypes.string.isRequired,
    label: PropTypes.any,
    availableLabels: PropTypes.instanceOf(Map).isRequired
  };

  load() {
    // Prop 'label' might be a "custom label" or passed down from wherever, we don't care,
    // if it's missing, we will try to load a new one from the server.
    const { dispatch, uri, label, availableLabels } = this.props;
    if (isLocalizedValueEmpty(label) && !availableLabels.has(uri)) {
      dispatch(getLabels([uri]));
    }
  }

  componentWillMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  render() {
    const { uri, label, availableLabels } = this.props;
    const finalLabel = isLocalizedValueEmpty(label) ? availableLabels.get(uri) : label;
    return <LocalizedValue localizedValue={finalLabel} defaultValue={uri}/>
  }
}

const selector = createStructuredSelector({
  availableLabels: labelsSelector
});

export default connect(selector)(makePureRender(Label));
