import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import { Lens, ResourceThroughLens } from '../models'

const SearchResultRow = ({ searchableLens, resource }) => {
  return (
    <TableRow>
      {searchableLens.showProperties.map(propertyUri =>
        <TableRowColumn key={propertyUri}>
          {resource.properties.getIn([propertyUri, 'variants', 'nolang'])}
        </TableRowColumn>
      )}
    </TableRow>
  );
};

SearchResultRow.propTypes = {
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  resource: PropTypes.instanceOf(ResourceThroughLens).isRequired
};

export default SearchResultRow;
