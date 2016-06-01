import React, { PropTypes, Component } from 'react'

class DelayedRender extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    delay: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ show: true }), this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    if (!this.state.show) {
      return null;
    }

    return this.props.children;
  }
}

export default DelayedRender;
