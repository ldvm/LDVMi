import React, { PropTypes } from 'react'
import Loading from './Loading'
import Alert from './Alert'
import { PromiseStatus } from '../../modules/core/models'

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

// This way we support both prop formats, the actual PromiseStatus object or status destructed
// into individual isLoading and error props.
export default ({ status, isLoading, error }) => {
  if (status instanceof PromiseStatus) {
    return <PromiseResult isLoading={status.isLoading} error={status.error} />;
  } else {
    return <PromiseResult isLoading={isLoading} error={error} />;
  }
};
