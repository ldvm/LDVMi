define(['angular'], function (ng) {
    'use strict';

    ng.module('pipeline.directives', []).
        directive('forceLayout', [function () {
            return {
                restrict: 'E',
                scope: {
                    data: '='
                },
                template: '<div></div>',
                link: function (scope, element, attributes) {

                    var width = attributes.width || 960,
                        height = attributes.height || 500;

                    var color = d3.scale.category20();

                    scope.$watch('data', function (json) {
                        element.html("");
                        if (json) {
                            var svg = d3.select(element[0]).append("svg")
                                .attr("width", width)
                                .attr("height", height);


                            var force = d3.layout.force()
                                .gravity(.05)
                                .distance(100)
                                .charge(-100)
                                .size([width, height]);

                            force
                                .nodes(json.nodes)
                                .links(json.links)
                                .start();

                            var link = svg.selectAll(".link")
                                .data(json.links)
                                .enter().append("line")
                                .attr("class", "link");

                            var node = svg.selectAll(".node")
                                .data(json.nodes)
                                .enter().append("g")
                                .attr("class", "node")
                                .call(force.drag);

                            node.append("circle")
                                .attr("class", "node-cirlce")
                                .attr("r", 15)
                                .style("fill", function(d, i) { return color(d.group); })
                                .style("stroke", function(d, i) { return "white"; })
                                .call(force.drag);

                            node.append("image")
                                .attr("xlink:href", "https://github.com/favicon.ico")
                                .attr("x", -8)
                                .attr("y", -8)
                                .attr("width", 16)
                                .attr("height", 16);

                            node.append("text")
                                .attr("dx", 20)
                                .attr("dy", ".55em")
                                .text(function(d) { return d.name });

                            force.on("tick", function() {
                                link.attr("x1", function(d) { return d.source.x; })
                                    .attr("y1", function(d) { return d.source.y; })
                                    .attr("x2", function(d) { return d.target.x; })
                                    .attr("y2", function(d) { return d.target.y; });

                                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                            });
                        }
                    });

                }
            };
        }]);
});