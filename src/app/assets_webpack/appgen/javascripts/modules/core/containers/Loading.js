import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { loadingSelector } from '../../core/ducks/loading'

const Loading = props => {
  if (props.loading == 0) {
    return <span />;
  }

  return props.children;
};

Loading.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.number.isRequired
};

const selector = createStructuredSelector({
  loading: loadingSelector
});

export default connect(selector)(Loading)
