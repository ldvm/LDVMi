define(['angular', 'jquery', 'jquery-sparkline', './directives'], function (ng, $, spark) {
    'use strict';

    ng.module('ldvm.directives')
        .directive('sparklineBar', [function(){
            return {
                scope: {
                    sparklineBar: '='
                },
                link: function($scope, $element) {

                    function sparklineBar(element, values, height, barWidth, barColor, barSpacing) {
                        element.sparkline(values, {
                            type: 'bar',
                            height: height,
                            barWidth: barWidth,
                            barColor: barColor,
                            barSpacing: barSpacing
                        });
                    }

                    function render(data) {
                        if ($element[0]) {
                            sparklineBar($element, data, '45px', 3, '#fff', 2);
                        }
                    }

                    $scope.$watch('sparklineBar', function (newVal) {
                        render(newVal || []);
                    }, true);
                }
            };
        }]);
});