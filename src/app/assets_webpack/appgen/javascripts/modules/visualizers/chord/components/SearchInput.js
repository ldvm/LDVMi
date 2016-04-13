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
    const value = this.refs.text.getValue();
    if (value) {
      onSearch(value);
    }
  }

  render() {
    return (
      <div>
        <TextField
          ref="text"
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
