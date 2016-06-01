import React, { PropTypes } from 'react'
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import { Lens, ResourceThroughLens } from '../models'
import LocalizedValue from '../../../app/containers/LocalizedValue'
import AddToListButtons from '../containers/AddToListButtons'

const SearchResultRow = ({ searchableLens, resource }) => {
  return (
    <TableRow>
      {searchableLens.showProperties.map(propertyUri =>
        <TableRowColumn key={propertyUri}>
          <LocalizedValue localizedValue={resource.properties.get(propertyUri)} silent />
        </TableRowColumn>
      )}
      <TableRowColumn>
        <AddToListButtons uri={resource.uri} />
      </TableRowColumn>
    </TableRow>
  );
};

SearchResultRow.propTypes = {
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  resource: PropTypes.instanceOf(ResourceThroughLens).isRequired
};

export default SearchResultRow;
