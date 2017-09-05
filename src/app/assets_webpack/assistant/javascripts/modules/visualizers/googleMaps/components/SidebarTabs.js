import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import Paper from 'material-ui/Paper';
import RefreshMapButton from '../containers/RefreshMapButton'
import SaveButton from '../containers/SaveButton'
import FillInScreen from '../../../../components/FillInScreen'
import Padding from '../../../../components/Padding'
import FilterConfig from '../containers/FilterConfig'
import FilterPreview from '../containers/FilterPreview'
import NoFiltersAvailable from './NoFiltersAvailable'

class SidebarTabs extends Component {
  static propTypes = {
    filters: PropTypes.instanceOf(Map)
  };

  render() {
    const { filters } = this.props;

    return <Paper zDepth={2}>
      {/* We need to force the FillInScreen component to update when a tab becomes active. */}
      <Tabs inkBarStyle={{ backgroundColor: 'white' }} onChange={::this.forceUpdate}>
        <Tab label="Configure">
          <FillInScreen marginBottom={100}>
            <div>
              {filters.size == 0 && <NoFiltersAvailable />}
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
              {filters.size == 0 && <NoFiltersAvailable />}
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
}

export default SidebarTabs;
