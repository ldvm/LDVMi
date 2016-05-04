import React, { Component, PropTypes } from 'react'
import Chord from '../misc/Chord'
import { getAvailableVerticalSpace } from '../../../../components/FillInScreen'
import { bodyPaddingSpace } from '../../../../components/BodyPadding'
import { makePureRenderDebug } from '../../../../misc/makePureRender'

class D3Chord extends Component {
  static propTypes = {
    matrix: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
    directed: PropTypes.bool.isRequired,
    displayAsUndirected: PropTypes.bool.isRequired
  };

  componentDidMount() {
    const container = this.refs.container;
    const size = Math.max(getAvailableVerticalSpace(container) - bodyPaddingSpace, 450);

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
    const { nodes, matrix, directed, displayAsUndirected  } = this.props;
    console.log('update chord!');
    this.chord.update(nodes, matrix, directed, displayAsUndirected);
  }

  render() {
    return <div ref="container"></div>
  }
}

export default makePureRenderDebug(D3Chord);
