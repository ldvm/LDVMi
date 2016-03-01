define(['angular', 'jquery', 'pipeline-visualizer', './directives'], function (ng, $, d3LdvmPipeline) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive('pipeline', [
            function () {
                return {
                    restrict: 'E',
                    scope: {
                        data: '='
                    },
                    link: function ($scope, elm) {

                        const WIDTH = 800;
                        const HEIGHT = 500;
                        const COMPONENT_SIZE = 70;
                        const COMPONENT_TYPES = ['suit', 'licensing', 'resolved'];

                        var pipeline = d3LdvmPipeline()
                            .width(WIDTH)
                            .height(HEIGHT)
                            .nodeSize(COMPONENT_SIZE)
                            .componentTypes(COMPONENT_TYPES);

                        $scope.$watch('data', function (newVal) {
                            if (newVal) {
                                d3.select($(elm).get(0))
                                    .datum(newVal)
                                    .call(pipeline);
                            }
                        });
                    }
                };
            }]
    );
});

