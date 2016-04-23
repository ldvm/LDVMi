import React, { Component, PropTypes } from 'react'
import Chord from '../misc/Chord'
import { getAvailableVerticalSpace } from '../../../../components/FillInScreen'
import { bodyPaddingSpace } from '../../../../components/BodyPadding'

class D3Chord extends Component {
  static propTypes = {
    matrix: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired
  };

  componentDidMount() {
    const container = this.refs.container;
    const size = Math.max(getAvailableVerticalSpace(container) - bodyPaddingSpace, 500);

    this.chord = new Chord(this.refs.container, size, size);
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
