import React, { PropTypes } from 'react'
import ClearBoth from './ClearBoth'

const ButtonContainer = ({ buttons }) => {
  const buttonWidth = (100 / buttons.length) + '%';

  return <div>
    {buttons.map((button, i) => (
      <div style={{ float: 'left', width: buttonWidth }} key={i}>
        {button}
      </div>
    ))}
    <ClearBoth />
  </div>;
};

ButtonContainer.propTypes = {
  buttons: PropTypes.array.isRequired
};

export default ButtonContainer;
