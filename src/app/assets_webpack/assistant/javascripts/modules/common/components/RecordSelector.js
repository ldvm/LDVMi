import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { extractFromLocalizedValue } from '../../app/misc/languageUtils'
import { Map  as immutableMap, Set as ImmutableSet } from 'immutable'
import { getLabels, labelsSelector } from '../../app/ducks/labels'
import { langSelector } from '../../app/ducks/lang'
import Button from '../../../components/Button'
import CenteredMessage from '../../../components/CenteredMessage'
import { CardHeader, Checkbox, List, ListItem, TextField } from 'material-ui'

class RecordSelector extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,

    // Labels
    labels: PropTypes.instanceOf(immutableMap).isRequired,
    language: PropTypes.string.isRequired,

    // Keys
    records: PropTypes.array.isRequired,
    getKey: PropTypes.func.isRequired,
    selectedKeys: PropTypes.instanceOf(ImmutableSet).isRequired,

    // Selectors
    onKeySelect: PropTypes.func.isRequired
  };


  componentWillMount() {
    this.needle = '';
    this.page = 0;
  }

  // SEARCH
  setNeedle() {
    var needleWasEmpty = this.needle == '';
    var elements = document.getElementsByName('search');

    if (elements.length > 0)
      this.needle = elements[0].value.toLowerCase();

    if (!needleWasEmpty || this.needle != '') {
      this.forceUpdate();
    }
  };

  resetNeedle() {
    this.needle = '';

    var elements = document.getElementsByName('search');
    if (elements.length > 0) {
      elements[0].value = '';
    }
    this.forceUpdate();
  }

  getSearchComponent() {
    var resetEnabled = (this.needle && this.needle != '');
    return <div style={{textAlign: 'center'}}>
      <TextField type="text" name="search" onChange={() => this.setNeedle()} hintText={'\tSearch ...'}/>
      <Button raised={resetEnabled}
              onTouchTap={() => this.resetNeedle()}
              disabled={!resetEnabled}
              label="RESET"
      />
    </div>
  }

  // === CHECKBOX LIST ===
  isChecked(key) {
    const {selectedKeys} = this.props;
    if (selectedKeys.contains(key)) {
      return true;
    }
    return false;
  }

  getLabel(key) {
    const {dispatch, labels} = this.props;
    if (!labels.has(key)) {
      dispatch(getLabels([key]));
      return key;
    }
    else {
      return extractFromLocalizedValue(this.props.language, labels.get(key), key);
    }
  }

  getMatchingRecords(map) {
    var matchingValues = new Map();

    for (const [key, value] of map) {
      if (value.toLowerCase().includes(this.needle)) {
        matchingValues.set(key, value);
      }
    }

    return matchingValues;
  }

  getValuesForVisualization() {
    const {records, getKey} = this.props;

    // Deduplication
    var map = new Map(records.map(t => {
      var key = getKey(t);
      return [key, this.getLabel(key)]
    }));

    // Needle Search
    if (this.needle && this.needle != '') {
      return this.getMatchingRecords(map);
    }
    else return map;
  }

  getCheckboxRows(valuesMap) {
    const {onKeySelect} = this.props;

    var valuesMap = this.getValuesForVisualization();

    var counter = 0;
    var rows = [];

    if (valuesMap.size > 0) {
      for (const [key, value] of valuesMap) {

        // Checkbox props
        const checked = this.isChecked(key);

        // Row render - only for current page
        var currentPage = parseInt(counter / 10);
        if (currentPage == this.page) {
          rows.push(
            <ListItem key={key}>
              <Checkbox
                onCheck={(e, k) => onKeySelect(key)}
                defaultChecked={checked}
                label={value}/>
            </ListItem>
          );
        }
        ++counter;
      }
    }
    else rows = <ListItem>
      <CenteredMessage>No values found.</CenteredMessage>
    </ListItem>;

    return rows;
  }

  // Bottom navigation
  getNavigationToolbar(totalPages) {
    const nextEnabled = this.page < totalPages;
    const nextFunc = () => {
      ++this.page;
      this.forceUpdate();
    };

    const prevEnabled = this.page > 0;
    const prevFunc = () => {
      --this.page;
      this.forceUpdate();
    };

    return (
      <div>
        <CenteredMessage>Page {this.page + 1} of {totalPages + 1}</CenteredMessage>
        <table>
          <tbody>
          <tr>
            <td>
              <Button raised={prevEnabled}
                      onTouchTap={prevFunc}
                      disabled={!prevEnabled}
                      label="PREVIOUS"
              />
            </td>
            <td>
              <Button raised={nextEnabled}
                      onTouchTap={nextFunc}
                      disabled={!nextEnabled}
                      label="NEXT"
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

// === RENDERING ===
  render() {
    var valuesMap = this.getValuesForVisualization();
    var pages = parseInt(valuesMap.size / 10);
    if (valuesMap.size > 0 && valuesMap.size % 10 == 0) --pages;

    return <div>
      <CardHeader>{this.props.header}</CardHeader>
      {this.getSearchComponent()}
      <List>
        {this.getCheckboxRows(valuesMap)}
      </List>
      {this.getNavigationToolbar(pages)}
      <hr/>
    </div>
  }
}
const selector = createStructuredSelector({
  labels: labelsSelector,
  language: langSelector
});

export default connect(selector)(RecordSelector);