import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { limit_default, limitSelector, setLimit, setLimitReset } from '../ducks/limit'
import Button from '../../../components/Button'

class LimiterContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired
  };

  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch(setLimitReset());
  }

  componentDidUpdate() {
    const {limit} = this.props;
    var elements = document.getElementsByName('limit');
    if (elements.length > 0) {
      elements[0].value = limit;
    }
  }

  setLimit() {
    const {dispatch} = this.props;

    var elements = document.getElementsByName('limit');
    if (elements.length > 0) {
      const value = parseInt(elements[0].value);
      dispatch(setLimit(value));
    }
  }

  resetLimit() {
    const {dispatch, limit} = this.props;
    dispatch(setLimitReset());

    var elements = document.getElementsByName('limit');
    if (elements.length > 0) {
      elements[0].value = limit_default;
    }
  };

  render() {
    const {limit} = this.props;

    var resetEnabled = limit != limit_default;
    return <div>
      <table>
        <tbody>
        <tr>
          <th>LIMIT</th>
          <th><input type="value" name="limit" defaultValue={limit} onChange={() => this.setLimit()}/></th>
          <th><Button raised={resetEnabled}
                      onTouchTap={() => this.resetLimit()}
                      disabled={!resetEnabled}
                      label="RESET"
          /></th>
        </tr>
        </tbody>
      </table>
    </div>

  }
}

const selector = createStructuredSelector({
  limit: limitSelector
});

export default connect(selector)(LimiterContainer);
