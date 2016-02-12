import React, { PropTypes } from 'react'
import Loading from './Loading'
import Alert from './Alert'

const PromiseResult = ({error, isLoading}) => {
  if (isLoading === true) {
    return <Loading>Loading...</Loading>
  } else if (error) {
    return <Alert danger>{error}</Alert>;
  } else {
    return <span />;
  }
};

PromiseResult.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

export default PromiseResult;
