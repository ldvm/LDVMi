import d3 from 'd3'
import * as colors from '../../../../misc/theme'

/**
 * Class wrapping the logic of D3.js Chord visualization. It provides a clean API that can be
 * bound to React component's lifecycle methods.
 *
 * Inspiration: https://bost.ocks.org/mike/uberdata/
 */
class Chord {
  constructor(domEl, width, height) {
    const outerRadius = Math.min(width, height) / 2 - 10;
    const innerRadius = outerRadius - 24;

    const arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const layout = d3.layout.chord()
      .padding(.04)
      .sortSubgroups(d3.descending)
      .sortChords(d3.ascending);

    const path = d3.svg.chord()
      .radius(innerRadius);

    const svg = d3.select(domEl).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('id', 'circle')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    svg.append('circle')
      .attr('r', outerRadius)
      .attr('fill', 'none');

    // To make all of the above properties private, the public methods have to be defined like this
    // within the scope with the private properties.

    /** Update with new data */
    this.update = (nodes, matrix) => {
      // Compute the chord layout.
      layout.matrix(matrix);

      // Create color scale
      const palette = [colors.primary, colors.danger, colors.info, colors.success];
      const color = d3.scale.linear()
        .domain(palette.map((_, i) => i * (nodes.length / palette.length)))
        .range(palette);

      // Helping functions to compare nodes by their size (= out degree)
      const getBiggerNode = (source, target) =>
        nodes[source.index].outDegree >= nodes[target.index].outDegree ? source.index : target.index;
      const getSmallerNode = (source, target) =>
        nodes[source.index].outDegree < nodes[target.index].outDegree ? source.index : target.index;

      // Little terminology:
      // - group corresponds to a node (those arcs around the circle)
      // - chord corresponds to and edge between nodes (those arcs between groups)

      // Add a group per node.
      const group = svg.selectAll('.group')
        .data(layout.groups)
        .enter().append('g')
        .attr('class', 'group')
        .on('mouseover', fadeChords(.1))
        .on('mouseout', fadeChords(1));

      // Add a mouseover title.
      group.append('title').text(function (d, i) {
        return nodes[i].label + '\n' + nodes[i].uri;
      });

      // Add the group arc (~ nodes).
      const groupPath = group.append('path')
        .attr('id', (_, i) => 'group' + i)
        .attr('d', arc)
        .style('fill', (d, i) => d3.rgb(color(i)).darker(0.3));

      // Add a text label.
      var groupText = group.append('text')
        .attr('x', 6)
        .attr('dy', 15)
        .attr('fill', 'white')
        .attr('style', 'font-size: 12px');

      groupText.append('textPath')
        .attr('xlink:href', (_, i) => '#group' + i)
        .text(function (d, i) {
          return nodes[i].label;
        });

      // Remove the labels that don't fit. :(
      groupText.filter(function (d, i) {
          return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
        })
        .remove();

      // Add the chords (~ edges).
      const chord = svg.selectAll('.chord')
        .data(layout.chords)
        .enter().append('path')
        .attr('class', 'chord')
        .style('fill', ({ source, target }) => {
          // To make the coloring more unified, we always choose the color of the "smaller" node.
          // The result is that all spectrum of colors is coming to the bigger nodes, visualizing
          // nicely the diversity.
          return color(getSmallerNode(source, target));
        })
        .attr('d', path)
        .attr('stroke', '#000')
        .attr('stroke-width', '.25px')
        .on('mouseover', fadeGroups(.1))
        .on('mouseout', fadeGroups(1));

      // Add an elaborate mouseover title for each chord.
      chord.append('title').text(function (d) {
        return nodes[getBiggerNode(d.source, d.target)].label
          + '\n' + nodes[getSmallerNode(d.source, d.target)].label
          + '\n(' + d.source.value + ')';
      });

      function fadeChords(opacity) {
        return (g, i) => {
          chord
            .filter(({ source, target }) => source.index != i && target.index != i)
            .transition()
            .style('opacity', opacity);
        };
      }

      function fadeGroups(opacity) {
        return ({ source, target }) => {
          group
            .filter(d => d.index != source.index && d.index != target.index)
            .transition()
            .style('opacity', opacity);

          chord
            .filter(d => d.source.index != source.index || d.target.index != target.index)
            .transition()
            .style('opacity', opacity);
        }
      }
    };

    /** Clean-up when the D3.js visualization is being destroyed */
    this.destroy = () => {};
  }
}

export default Chord;
