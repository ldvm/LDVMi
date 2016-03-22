import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';
import RefreshMapButton from '../containers/RefreshMapButton'
import SaveButton from '../containers/SaveButton'
import FillInScreen from '../../../../components/FillInScreen'
import Button from '../../../../components/Button'
import Padding from '../../../../components/Padding'
import FilterConfig from '../containers/FilterConfig'
import FilterPreview from '../containers/FilterPreview'
import { Application } from '../../../manageApp/models'

const SidebarTabs = ({ filters }) => {

  return <Paper zDepth={2}>
    <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
      <Tab label="Configure">
        <FillInScreen marginBottom={100}>
          <div>
            {filters.toList().map(filter =>
              <div key={filter.property.uri}>
                <FilterConfig filter={filter} />
              </div>
            )}
          </div>
        </FillInScreen>
        <Padding space={2}>
          <SaveButton fullWidth />
        </Padding>
      </Tab>
      <Tab label="Preview">
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
      </Tab>
    </Tabs>
  </Paper>
};

SidebarTabs.propTypes = {
  filters: PropTypes.instanceOf(Map)
};

export default SidebarTabs;
