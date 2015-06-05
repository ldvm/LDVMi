define(['angular', './directives'], function (ng) {
    'use strict';

    ng.module('ldvm.directives')
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