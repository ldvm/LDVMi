import React, { PropTypes } from 'react'
import { List } from 'immutable';
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip'
import MaterialTheme from '../../../misc/materialTheme'
import ClearBoth from '../../../components/ClearBoth'

const dataSourceStyle = {
  float: 'left',
  marginRight: MaterialTheme.spacing.desktopGutterMini,
  marginBottom: MaterialTheme.spacing.desktopGutterMini
};

const dividerStyle = {
  marginTop: MaterialTheme.spacing.desktopGutterMini,
  marginBottom: MaterialTheme.spacing.desktopGutterLess,
};

const SelectedDataSources = ({ dataSources, deselectDataSource }) => {
  return <div>
    {dataSources.map(dataSource =>
      <Chip
        key={dataSource.id}
        onRequestDelete={() => deselectDataSource(dataSource.id)}
        style={dataSourceStyle}
      >
        {dataSource.name}
      </Chip>
    )}

    <ClearBoth />
    <Divider style={dividerStyle}/>
  </div>
};

SelectedDataSources.propTypes = {
  dataSources: PropTypes.instanceOf(List).isRequired,
  deselectDataSource: PropTypes.func.isRequired
};

export default SelectedDataSources;
