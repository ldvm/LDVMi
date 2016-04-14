import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Paper from 'material-ui/lib/paper'
import Table from 'material-ui/lib/table/table'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableBody from 'material-ui/lib/table/table-body'
import TableRow from 'material-ui/lib/table/table-row'
import { Lens } from '../models'
import CenteredMessage from '../../../../components/CenteredMessage'
import IgnoreDialogPadding from '../../../../components/IgnoreDialogPadding'
import SearchResultRow from './SearchResultRow'

const SearchResult = ({ searchableLens, result }) => {
  if (result.size == 0) {
    return <CenteredMessage><br />No results available. Try different search phrase</CenteredMessage>
  }

  return (
    <IgnoreDialogPadding horizontal bottom>
      <Table selectable={false} height="300">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            {searchableLens.showProperties.map(propertyUri =>
              <TableHeaderColumn key={propertyUri}>
                {propertyUri}
              </TableHeaderColumn>
            )}
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} allowMultiselect>
          {result.map(resource =>
            <SearchResultRow
              key={resource.uri}
              resource={resource}
              searchableLens={searchableLens}
            />
          )}
        </TableBody>
      </Table>
    </IgnoreDialogPadding>
  );
};

SearchResult.propTypes = {
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  result: PropTypes.instanceOf(List).isRequired
};

export default SearchResult;
