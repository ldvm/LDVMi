import React, { PropTypes } from 'react'
import CenteredMessage from '../../../../components/CenteredMessage'
import Padding from '../../../../components/Padding'

const NoFiltersAvailable = () => (
  <Padding space={2}>
    <CenteredMessage>
      Filters are not available as no filtering properties were discovered.
    </CenteredMessage>
  </Padding>
);

export default NoFiltersAvailable;
