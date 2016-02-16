import React, { PropTypes } from 'react'
import { List } from 'immutable';
import { dialogClose } from '../../../ducks/dialog'
import Button from '../../../misc/components/Button'
import Dialog from '../../../containers/Dialog';
import CenteredMessage from '../../../misc/components/CenteredMessage'

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

export const dialogName = 'BROWSE_DATA_SOURCES_DIALOG';

const BrowseDataSourcesDialog = (props) =>  {
  const {dialogClose, selectDataSource, deselectDataSource, dataSources} = props;

  const actions = [
    <Button label="Close"
      onTouchTap={() => dialogClose(dialogName)} />
  ];

  return (
    <Dialog name={dialogName} title="Browse data sources" actions={actions} modal={false}>
      {dataSources.size == 0 &&
        <CenteredMessage>No data sources available. Please try to add some first.</CenteredMessage>}

      {dataSources.size > 0 &&
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Private</TableHeaderColumn>
              <TableHeaderColumn>Select</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} allowMultiselect>
            {dataSources.map(dataSource =>
              <TableRow selected key={dataSource.id}>
                <TableRowColumn>{dataSource.name}</TableRowColumn>
                <TableRowColumn>???</TableRowColumn>
                <TableRowColumn>
                  {dataSource.selected ?
                    <Button primary label="Remove"
                      onTouchTap={() => deselectDataSource(dataSource.id)} /> :
                    <Button success label="Add"
                      onTouchTap={() => selectDataSource(dataSource.id)} />
                  }
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>}

    </Dialog>
  );
};

BrowseDataSourcesDialog.dialogName = dialogName;

BrowseDataSourcesDialog.propTypes = {
  dialogClose: PropTypes.func.isRequired,
  selectDataSource: PropTypes.func.isRequired,
  deselectDataSource: PropTypes.func.isRequired,
  dataSources: PropTypes.instanceOf(List).isRequired
};

export default BrowseDataSourcesDialog;
