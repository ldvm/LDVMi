define(['angular', 'd3js', 'jquery'], function (ng, d3, $) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive('treemap', [function () {
            return {
                restrict: 'E',
                scope: {
                    scheme: '='
                },
                link: function ($scope, element) {

                    function refresh() {

                        element.html("");

                        var w = 1220,
                            h = 600,
                            x = d3.scale.linear().range([0, w]),
                            y = d3.scale.linear().range([0, h]);

                        var vis = d3.select(element[0]).append("div")
                            .attr("class", "chart")
                            .style("width", w + "px")
                            .style("height", h + "px")
                            .append("svg:svg")
                            .attr("width", w)
                            .attr("height", h);

                        var partition = d3.layout.partition()
                            .value(function (d) {
                                return d.size;
                            });

                        var g = vis.selectAll("g")
                            .data(partition.nodes($scope.scheme))
                            .enter().append("svg:g")
                            .attr("transform", function (d) {
                                return "translate(" + x(d.y) + "," + y(d.x) + ")";
                            })
                            .on("click", click);

                        var kx = w / $scope.scheme.dx,
                            ky = h / 1;

                        g.append("svg:rect")
                            .attr("width", $scope.scheme.dy * kx)
                            .attr("height", function (d) {
                                return d.dx * ky;
                            })
                            .attr("class", function (d) {
                                return d.children ? "parent" : "child";
                            });

                        g.append("svg:text")
                            .attr("transform", transform)
                            .attr("dy", ".35em")
                            .style("opacity", function (d) {
                                return d.dx * ky > 12 ? 1 : 0;
                            })
                            .text(function (d) {
                                return d.name;
                            });

                        d3.select(window)
                            .on("click", function () {
                                click($scope.scheme);
                            });

                        function click(d) {
                            if (!d.children) return;

                            kx = (d.y ? w - 40 : w) / (1 - d.y);
                            ky = h / d.dx;
                            x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
                            y.domain([d.x, d.x + d.dx]);

                            var t = g.transition()
                                .duration(d3.event.altKey ? 7500 : 750)
                                .attr("transform", function (d) {
                                    return "translate(" + x(d.y) + "," + y(d.x) + ")";
                                });

                            t.select("rect")
                                .attr("width", d.dy * kx)
                                .attr("height", function (d) {
                                    return d.dx * ky;
                                });

                            t.select("text")
                                .attr("transform", transform)
                                .style("opacity", function (d) {
                                    return d.dx * ky > 12 ? 1 : 0;
                                });

                            d3.event.stopPropagation();
                        }

                        function transform(d) {
                            return "translate(8," + d.dx * ky / 2 + ")";
                        }
                    }

                    $scope.$watch('scheme', function (newVal) {
                        if (newVal) {
                            refresh();
                        }
                    });
                }
            };
        }]
    );
});