import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import makePureRender from '../../../misc/makePureRender'
import LocalizedValue from './LocalizedValue'

class Label extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uri: PropTypes.string.isRequired,
    label: PropTypes.any.isRequired
  };

  componentDidMount() {
    // TODO: possibly load missing label
    // Prop 'label' might be a "custom label" or passed down from wherever, we don't care,
    // if it's missing, we will try to load a new one from the server.
  }

  render() {
    const { uri, label } = this.props;
    return <LocalizedValue value={label} defaultValue={uri} />
  }
}

export default connect()(makePureRender(Label));
