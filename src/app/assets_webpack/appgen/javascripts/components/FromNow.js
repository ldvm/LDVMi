import React, { Component, PropTypes } from 'react'
import moment from 'moment'

/**
 * Displays given timestamp in a user-friendly relative format, e. g., "a few seconds ago",
 * "8 minutes ago", "28 days ago" etc. The relative time information is being automatically
 * updated.
 */
class FromNow extends Component {
  static propTypes = {
    timestamp: PropTypes.number.isRequired
  };

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    const m = moment(this.props.timestamp);
    return (
      <span title={m.format('LLL')}>
        {m.fromNow()}
      </span>
    )
  }
}

export default FromNow;
