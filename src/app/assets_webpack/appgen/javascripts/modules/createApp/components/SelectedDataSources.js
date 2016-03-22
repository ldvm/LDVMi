import React, { PropTypes } from 'react'
import { List } from 'immutable';
import Paper from 'material-ui/lib/paper';
import Divider from 'material-ui/lib/divider';
import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import MaterialTheme from '../../../misc/materialTheme';

const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

const dataSourceStyle = {
  float: 'left',
  lineHeight: '48px',
  paddingLeft: spacing,
  marginRight: spacing,
  marginBottom: spacing
};

const iconStyle = {
  float: 'right',
  marginLeft: spacing
};

const dividerStyle = {
  marginBottom: spacing,
  clear: 'both'
};

const SelectedDataSources = ({ dataSources, deselectDataSource }) => {
  return <div>
    {dataSources.map(dataSource =>
      <Paper style={dataSourceStyle} key={dataSource.id}>
        {dataSource.name}
        <IconButton icon="remove_circle" tooltip="Remove data source" style={iconStyle}
                    onTouchTap={() => deselectDataSource(dataSource.id)}/>
      </Paper>
    )}
    <Divider style={dividerStyle}/>
  </div>
};

SelectedDataSources.propTypes = {
  dataSources: PropTypes.instanceOf(List).isRequired,
  deselectDataSource: PropTypes.func.isRequired
};

export default SelectedDataSources;
