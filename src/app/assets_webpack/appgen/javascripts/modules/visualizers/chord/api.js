import rest from '../../../misc/rest'

export async function getGraph(id) {
  const result = await rest('chordVisualizer/getGraph/' + id, {});
  return result.data.graph;
}

export async function getEdges(id) {
  const result = await rest('chordVisualizer/getEdges/' + id, {});
  return result.data.edges;
}

export async function getMatrix(id) {
  const result = await rest('chordVisualizer/getMatrix/' + id, {});
  return result.data.matrix;
}

export async function getSearchableLens(id) {
  const result = await rest('chordVisualizer/getSearchableLens/' + id, {});
  return result.data.lens;
}
