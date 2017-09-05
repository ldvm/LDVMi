import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getLabels, labelsSelector } from '../ducks/labels'
import { commentsSelector, getComments } from '../ducks/comments'
import { Map as ImmutableMap } from 'immutable'
import LocalizedValue from './LocalizedValue'
import makePureRender from '../../../misc/makePureRender'

// Shows all available info about an object.
class ObjectInfo extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    header: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,

    availableLabels: PropTypes.instanceOf(ImmutableMap).isRequired,
    availableComments: PropTypes.instanceOf(ImmutableMap).isRequired
  };

  load() {
    const { dispatch, url, availableLabels, availableComments } = this.props;
    if (!availableLabels.has(url)) {
      dispatch(getLabels([url]));
    }
    if (!availableComments.has(url)) {
      dispatch(getComments([url]));
    }
  }

  componentWillMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  render() {
    const { header, url, availableComments, availableLabels } = this.props;

    return <table>
      <tbody>
      <tr>
        <td><b>{header}: </b></td>
        <td>{url}</td>
      </tr>
      <tr>
        <td>Label:</td>
        <td>
          <LocalizedValue localizedValue={availableLabels.get(url)} defaultValue="n/a"/>
        </td>
      </tr>
      <tr>
        <td>Comment:</td>
        <td>
          <LocalizedValue localizedValue={availableComments.get(url)} defaultValue="n/a"/>
        </td>
      </tr>
      </tbody>
    </table>
  }
}
const selector = createStructuredSelector({
  availableLabels: labelsSelector,
  availableComments: commentsSelector
});

export default connect(selector)(makePureRender(ObjectInfo));