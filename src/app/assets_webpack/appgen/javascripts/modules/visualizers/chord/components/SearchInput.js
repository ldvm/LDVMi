import React, { PropTypes, Component } from 'react'
import TextField from 'material-ui/TextField';
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

  onKeyDown(e) {
    const ENTER_KEY_CODE = 13;
    if (e.keyCode == ENTER_KEY_CODE) {
      this.search();
    }
  }

  render() {
    const { disabled } = this.props;
    return (
      <div>
        <TextField
          ref="needle"
          hintText="Identificator, part of the name..."
          style={textFieldStyle}
          disabled={disabled}
          onKeyDown={::this.onKeyDown}
        />
        <Button warning raised
          label="Search"
          icon="search"
          onTouchTap={::this.search}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default SearchInput;
