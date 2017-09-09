import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import makePureRender from '../../../misc/makePureRender'
import LocalizedValue from './LocalizedValue'
import { isLocalizedValueEmpty } from '../misc/languageUtils'
import { commentsSelector, getComments } from '../ducks/comments'

class Comment extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    uri: PropTypes.string.isRequired,
    comment: PropTypes.any,
    availableComments: PropTypes.instanceOf(Map).isRequired
  };

  load() {
    // Prop 'comment' might be a "custom comment" or passed down from wherever, we don't care,
    // if it's missing, we will try to load a new one from the server.
    const { dispatch, uri, comment, availableComments } = this.props;
    if (isLocalizedValueEmpty(comment) && !availableComments.has(uri)) {
      dispatch(getComments([uri]));
    }
  }

  componentWillMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  render() {
    const { uri, comment, availableComments } = this.props;
    const finalComment = isLocalizedValueEmpty(comment) ? availableComments.get(uri) : comment;
    return <LocalizedValue localizedValue={finalComment} defaultValue={uri}/>
  }
}

const selector = createStructuredSelector({
  availableComments: commentsSelector
});

export default connect(selector)(makePureRender(Comment));
