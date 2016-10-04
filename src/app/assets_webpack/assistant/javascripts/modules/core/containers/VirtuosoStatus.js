import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {PromiseStatus} from '../models'
import { getVirtuosoStatus, virtuosoStatusSelector } from '../ducks/virtuosoStatus'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'

class VirtuosoStatus extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getVirtuosoStatus());
  }

  render() {
    const { status } = this.props;

    if (!status.error) return null;

    return (
      <BodyPadding>
        <Alert warning>{status.error}</Alert>
      </BodyPadding>
    );
  }
}

const selector = createStructuredSelector({
  status: virtuosoStatusSelector
});

export default connect(selector)(VirtuosoStatus);
