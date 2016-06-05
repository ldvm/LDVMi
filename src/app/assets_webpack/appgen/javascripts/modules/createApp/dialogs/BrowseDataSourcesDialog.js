import React, { PropTypes } from 'react'
import { List } from 'immutable';
import Table from 'material-ui/Table/Table'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableHeader from 'material-ui/Table/TableHeader'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
import TableBody from 'material-ui/Table/TableBody'
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog'
import Pagination from '../../core/containers/Pagination'
import paginate from '../../core/containers/paginate'
import CenteredMessage from '../../../components/CenteredMessage'
import prefix from '../prefix'

export const dialogName = prefix('BROWSE_DATA_SOURCES_DIALOG');
export const paginatorName = prefix('BROWSE_DATA_SOURCES_PAGINATOR');

const BrowseDataSourcesDialog = (props) =>  {
  const { dialogClose, selectDataSource, deselectDataSource, dataSources } = props;

  const actions = [
    <Button label="Close"
      onTouchTap={() => dialogClose(dialogName)} />
  ];

  return (
    <Dialog name={dialogName} title="Browse data sources" actions={actions} modal={false}>
      {dataSources.size == 0 &&
        <CenteredMessage>No data sources available. Please try to add some first.</CenteredMessage>}

      {dataSources.size > 0 &&
        <div>
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
                      <Button primary label="Deselect"
                        onTouchTap={() => deselectDataSource(dataSource.id)} /> :
                      <Button success label="Select"
                        onTouchTap={() => selectDataSource(dataSource.id)} />
                    }
                  </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination name={paginatorName} />
        </div>}
    </Dialog>
  );
};

BrowseDataSourcesDialog.propTypes = {
  dialogClose: PropTypes.func.isRequired,
  selectDataSource: PropTypes.func.isRequired,
  deselectDataSource: PropTypes.func.isRequired,
  dataSources: PropTypes.instanceOf(List).isRequired
};

export default paginate({
  paginatorName,
  itemsSelector: (_, props) => props.dataSources,
  pageSize: 1,
  pageContentProp: 'dataSources'
}, BrowseDataSourcesDialog);
