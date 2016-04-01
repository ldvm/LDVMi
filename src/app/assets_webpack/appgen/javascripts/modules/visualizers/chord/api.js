import rest from '../../../misc/rest'

export async function getEdges(id) {
  const result = await rest('chordVisualizer/getEdges/' + id, {});
  return result.data.edges;
}

export async function getMatrix(id) {
  const result = await rest('chordVisualizer/getMatrix/' + id, {});
  return result.data.matrix;
}
