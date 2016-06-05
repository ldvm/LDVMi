import React, { PropTypes } from 'react'
import { List } from 'immutable';
import Table from 'material-ui/Table/Table'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableHeader from 'material-ui/Table/TableHeader'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
import TableBody from 'material-ui/Table/TableBody'
import Button from '../../../components/Button'
import IgnoreDialogPadding from '../../../components/IgnoreDialogPadding'
import Dialog from '../../core/containers/Dialog'
import Pagination from '../../core/containers/Pagination'
import paginate from '../../core/containers/paginate'
import CenteredMessage from '../../../components/CenteredMessage'
import Icon from '../../../components/Icon'
import PullLeft from '../../../components/PullLeft'
import prefix from '../prefix'
import { User } from '../../auth/models'

export const dialogName = prefix('BROWSE_DATA_SOURCES_DIALOG');
export const paginatorName = prefix('BROWSE_DATA_SOURCES_PAGINATOR');

const BrowseDataSourcesDialog = (props) =>  {
  const { dialogClose, selectDataSource, deselectDataSource, dataSources, user } = props;

  const actions = [
    <PullLeft>
      <Pagination name={paginatorName} />
    </PullLeft>,
    <Button label="Close"
      onTouchTap={() => dialogClose(dialogName)} />
  ];

  return (
    <Dialog name={dialogName} title="Browse data sources" actions={actions} autoScrollBodyContent={true}>
      {dataSources.size == 0 &&
        <CenteredMessage>No data sources available. Please try to add some first.</CenteredMessage>}

      {dataSources.size > 0 &&
        <IgnoreDialogPadding horizontal top>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{ width: '50%' }}>Name</TableHeaderColumn>
                <TableHeaderColumn>Is mine?</TableHeaderColumn>
                <TableHeaderColumn>Select</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} allowMultiselect>
              {dataSources.map(dataSource =>
                <TableRow selected key={dataSource.id}>
                  <TableRowColumn style={{ width: '50%' }}>{dataSource.name}</TableRowColumn>
                  <TableRowColumn>
                    {dataSource.userId == user.id &&
                      <Icon icon="done" />
                    }
                  </TableRowColumn>
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
        </IgnoreDialogPadding>}
    </Dialog>
  );
};

BrowseDataSourcesDialog.propTypes = {
  dialogClose: PropTypes.func.isRequired,
  selectDataSource: PropTypes.func.isRequired,
  deselectDataSource: PropTypes.func.isRequired,
  dataSources: PropTypes.instanceOf(List).isRequired,
  user: PropTypes.instanceOf(User).isRequired
};

export default paginate({
  paginatorName,
  itemsSelector: (_, props) => props.dataSources,
  pageSize: 5,
  pageContentProp: 'dataSources'
}, BrowseDataSourcesDialog);
