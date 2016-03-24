import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import Paper from 'material-ui/lib/paper';
import RefreshMapButton from '../containers/RefreshMapButton'
import FillInScreen from '../../../../components/FillInScreen'
import Padding from '../../../../components/Padding'
import FilterPreview from '../containers/FilterPreview'

const ApplicationFilters = ({ filters }) => {

  return <Paper zDepth={2}>
      <FillInScreen marginBottom={100}>
        <div>
          {filters.toList().map(filter =>
            <div key={filter.property.uri}>
              <FilterPreview filter={filter} />
            </div>
          )}
        </div>
      </FillInScreen>
      <Padding space={2}>
        <RefreshMapButton fullWidth />
      </Padding>
    </Paper>
};

ApplicationFilters.propTypes = {
  filters: PropTypes.instanceOf(Map)
};

export default ApplicationFilters;
