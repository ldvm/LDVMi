import React, { PropTypes, Component } from 'react'
import TextField from 'material-ui/lib/text-field'
import Button from '../../../../components/Button'

const textFieldStyle = {
  width: '70%',
  marginRight: '16px'
};

class SearchInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool.isRequired,
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
    const { disabled } = this.props;
    return (
      <div>
        <TextField
          ref="needle"
          hintText="Název, DIČ..."
          style={textFieldStyle}
          disabled={disabled}
          onEnterKeyDown={this.search.bind(this)}
        />
        <Button warning raised
          label="Search"
          icon="search"
          onTouchTap={this.search.bind(this)}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default SearchInput;
