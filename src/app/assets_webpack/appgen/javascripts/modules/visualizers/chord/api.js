import rest from '../../../misc/rest'

export async function getGraph(id) {
  const result = await rest('chordVisualizer/getGraph/' + id, {});
  return result.data.graph;
}

export async function getSampleNodes(id) {
  const result = await rest('chordVisualizer/getSampleNodes/' + id, {});
  return result.data.nodes;
}

export async function getEdges(id) {
  const result = await rest('chordVisualizer/getEdges/' + id, {});
  return result.data.edges;
}

export async function getMatrix(id, nodeUris) {
  const result = await rest('chordVisualizer/getMatrix/' + id, { nodeUris });
  return result.data.matrix;
}

export async function getSearchableLens(id) {
  const result = await rest('chordVisualizer/getSearchableLens/' + id, {});
  return result.data.lens;
}

export async function searchNodes(id, needle) {
  const result = await rest('chordVisualizer/searchNodes/' + id, { needle });
  return result.data.result;
}

export async function getRelatedNodes(id, nodeUri) {
  const result = await rest('chordVisualizer/getRelatedNodes/' + id, { nodeUri });
  return result.data.relatedNodes;
}
