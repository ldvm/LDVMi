import React, { PropTypes, Component } from 'react'
import TextField from 'material-ui/lib/text-field'
import Button from '../../../../components/Button'

const textFieldStyle = {
  width: '70%',
  marginRight: '16px'
};

class SearchInput extends Component {

  static propTypes = {
    onSearch: PropTypes.func.isRequired
  };

  search() {
    const { onSearch } = this.props;
    const needle = this.refs.needle.getValue();
    if (needle) {
      onSearch(needle);
    }
  }

  render() {
    return (
      <div>
        <TextField
          ref="needle"
          hintText="Název, DIČ..."
          style={textFieldStyle}
        />
        <Button warning raised
          label="Search"
          icon="search"
          onTouchTap={this.search.bind(this)}
        />
      </div>
    );
  }
}

export default SearchInput;
