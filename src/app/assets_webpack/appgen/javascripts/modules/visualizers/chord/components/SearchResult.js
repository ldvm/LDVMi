import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import { Lens } from '../models'
import Label from '../../../app/containers/Label'
import IgnoreDialogPadding from '../../../../components/IgnoreDialogPadding'
import SearchResultRow from './SearchResultRow'

const SearchResult = ({ searchableLens, result }) => (
  <IgnoreDialogPadding horizontal bottom>
    <Table selectable={false} height="300px">
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          {searchableLens.showProperties.map(propertyUri =>
            <TableHeaderColumn key={propertyUri}>
              <Label uri={propertyUri} />
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

SearchResult.propTypes = {
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  result: PropTypes.instanceOf(List).isRequired
};

export default SearchResult;
