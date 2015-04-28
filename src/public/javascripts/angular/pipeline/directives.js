define(['angular', 'jquery'], function (ng, $) {
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

                    scope.$watch('data', function (links) {
                        element.html("");
                        if (links) {
                            var nodes = {};

// Compute the distinct nodes from the links.
                            links.forEach(function (link) {
                                link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
                                link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
                            });

                            var width = $(element[0].parentElement).width(),
                                height = $(element[0].parentElement).width() / 2;

                            var force = d3.layout.force()
                                .nodes(d3.values(nodes))
                                .links(links)
                                .size([width, height])
                                .linkDistance(60)
                                .charge(-300)
                                .on("tick", tick)
                                .start();

                            var svg = d3.select(element[0]).append("svg")
                                .attr("width", width)
                                .attr("height", height);

// Per-type markers, as they don't inherit styles.
                            svg.append("defs").selectAll("marker")
                                .data(["suit", "licensing", "resolved"])
                                .enter().append("marker")
                                .attr("id", function (d) {
                                    return d;
                                })
                                .attr("viewBox", "0 -5 10 10")
                                .attr("refX", 15)
                                .attr("refY", -1.5)
                                .attr("markerWidth", 6)
                                .attr("markerHeight", 6)
                                .attr("orient", "auto")
                                .append("path")
                                .attr("d", "M0,-5L10,0L0,5");

                            var path = svg.append("g").selectAll("path")
                                .data(force.links())
                                .enter().append("path")
                                .attr("class", function (d) {
                                    return "link " + d.type;
                                })
                                .attr("marker-end", function (d) {
                                    return "url(#" + d.type + ")";
                                });

                            var circle = svg.append("g").selectAll("circle")
                                .data(force.nodes())
                                .enter().append("circle")
                                .attr("r", 6)
                                .call(force.drag);

                            var text = svg.append("g").selectAll("text")
                                .data(force.nodes())
                                .enter().append("text")
                                .attr("x", 8)
                                .attr("y", ".31em")
                                .text(function (d) {
                                    return d.name;
                                });

// Use elliptical arc path segments to doubly-encode directionality.
                            function tick() {
                                path.attr("d", linkArc);
                                circle.attr("transform", transform);
                                text.attr("transform", transform);
                            }

                            function linkArc(d) {
                                var dx = d.target.x - d.source.x,
                                    dy = d.target.y - d.source.y,
                                    dr = Math.sqrt(dx * dx + dy * dy);
                                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                            }

                            function transform(d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            }
                        }
                    });

                }
            };
        }])
        .directive('dynamicChart', [function () {
            return {
                scope: {
                    data: '='
                },
                link: function ($scope, $element) {

                    var plot = $.plot($element[0], [$scope.data] || [], {
                        series: {
                            label: "Discovered pipelines",
                            lines: {
                                show: true,
                                lineWidth: 0.2,
                                fill: 0.6
                            },

                            color: '#00BCD4',
                            shadowSize: 0,
                        },
                        yaxis: {
                            tickColor: '#eee',
                            font: {
                                lineHeight: 13,
                                style: "normal",
                                color: "#9f9f9f"
                            },
                            shadowSize: 0,
                            min: 0,
                            max: 10
                        },
                        xaxis: {
                            tickColor: '#eee',
                            show: true,
                            font: {
                                lineHeight: 13,
                                style: "normal",
                                color: "#9f9f9f"
                            },
                            shadowSize: 0,
                            min: 0
                        },
                        grid: {
                            borderWidth: 1,
                            borderColor: '#eee',
                            labelMargin: 10,
                            hoverable: true,
                            clickable: true,
                            mouseActiveRadius: 6
                        },
                        legend: {
                            container: '.flc-dynamic',
                            backgroundOpacity: 0.5,
                            noColumns: 0,
                            backgroundColor: "white",
                            lineWidth: 0
                        }
                    });

                    $scope.$watch('data', function (newVal) {
                        plot.setData([newVal]);
                        plot.draw();
                    }, true);
                }
            };
        }]);
});