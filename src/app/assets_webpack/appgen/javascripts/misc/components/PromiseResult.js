import React, { PropTypes } from 'react'
import FontIcon from 'material-ui/lib/font-icon'
import CircularProgress from 'material-ui/lib/circular-progress';

const PromiseResult = ({error, isLoading}) => {
  if (isLoading === true) {
    return <div>
      <CircularProgress size={0.5} style={{ float: 'left', marginRight: '8px' }}/>
      <div style={{ lineHeight: '50px' }}>Loading...</div>
    </div>
  } else if (error) {
    // TODO: create universal warning message component
    return <p>
      <FontIcon className="material-icons" style={{ float: 'left', marginRight: '8px' }}>error</FontIcon>
      {error}
    </p>;
  } else {
    return <span></span>;
  }
};

PromiseResult.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

export default PromiseResult;
