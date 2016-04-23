import React, { Component, PropTypes } from 'react'
import Chord from '../misc/Chord'

class D3Chord extends Component {
  static propTypes = {
    matrix: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.chord = new Chord(this.refs.container, 1000, 700);
    this.updateVisualization();
  }

  componentDidUpdate() {
    this.updateVisualization();
  }

  componentWillUnmount() {
    this.chord.destroy();
  }

  updateVisualization() {
    const { nodes, matrix } = this.props;
    this.chord.update(nodes, matrix);
  }

  render() {
    return <div ref="container"></div>
  }
}

export default D3Chord;
