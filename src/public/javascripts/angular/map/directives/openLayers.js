define(['angular', 'jquery', './directives'], function (ng, $) {
    'use strict';

    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) < 0;
        });
    };

    ng.module('map.directives')
        .directive('openLayers', [function () {
            return {
                scope: {
                    entities: '=',
                    colors: '='
                },
                link: function ($scope, $elm) {

                    var wktLayer;
                    var map;
                    var source;

                    function create(){
                        wktLayer = new ol.layer.Vector({
                            source: new ol.source.Vector({})
                        });

                        source = wktLayer.getSource();

                        map = new ol.Map({
                            layers: [
                                new ol.layer.Tile({
                                    source: new ol.source.OSM()
                                }),
                                wktLayer
                            ],
                            target: $elm[0],
                            view: new ol.View({
                                center: [1943590, 6076971],
                                zoom: 8
                            }),
                            interactions: ol.interaction.defaults().extend([
                                new ol.interaction.DragRotateAndZoom()
                            ])
                        });

                        var zoomslider = new ol.control.ZoomSlider();
                        map.addControl(zoomslider);
                    }

                    $scope.colors = $scope.colors || {};

                    function color(value) {
                        if (!$scope.colors[value]) {
                            $scope.colors[value] = "rgba(0, 0, 0, 0.6)";
                        }
                        return $scope.colors[value];
                    }

                    function update(entities) {

                        var format = new ol.format.WKT();
                        var features = [];
                        var mercator = new ol.proj.Projection({
                            code: 'EPSG:3857'
                        });
                        var prj = new ol.proj.Projection({
                            code: 'EPSG:4258',
                            axisOrientation: 'neu'
                        });

                        var swap = function(coords) {

                            if (coords && typeof(coords[0]) == 'number') {
                                var x = coords[0];
                                var y = coords[1];
                                coords[0] = y;
                                coords[1] = x;
                            } else if (coords){
                                coords.forEach(swap);
                            }
                            return coords;
                        };

                        var parseAndAddFeatures = function(e) {
                            var feature = format.readFeature(e.wkt);
                            // swap coordinates x, y -> y, x
                            var geom = feature.getGeometry();
                            var coords = geom.getCoordinates();
                            coords = swap(coords);
                            geom.setCoordinates(coords);

                            // transform between coordinate systems
                            feature.getGeometry().transform(prj, mercator);

                            //feature.color = color(e.groupPropertyValue);

                            if (e.title) {
                                feature.set('name', e.title.variants['sl']);
                            }
                            features.push(feature);
                        };

                        features = [];
                        ng.forEach(entities, parseAndAddFeatures);
                        source.getFeatures().forEach(source.removeFeature);
                        source.addFeatures(features);
/*
                        $scope.vector = new ol.layer.Vector({
                            style: (function () {
                                var getStyle = function (color) {
                                    return [new ol.style.Style({
                                        fill: new ol.style.Fill({
                                            color: color
                                        }),
                                        stroke: new ol.style.Stroke({
                                            color: 'black',
                                            width: 1
                                        })
                                    })];
                                };
                                return function (feature, resolution) {
                                    return getStyle(feature.color);
                                };
                            }()),
                            source: source
                        });*/

                        if (map) {
                            var extent = source.getExtent();
                            map.getView().fitExtent(extent, map.getSize());

                            var selectMouseMove = new ol.interaction.Select({
                                condition: ol.events.condition.mouseMove
                            });
                            map.addInteraction(selectMouseMove);

                            var info = $('.info', $scope.el);
                            info.tooltip({
                                animation: false,
                                trigger: 'manual'
                            });

                            var displayFeatureInfo = function (pixel) {
                                info.css({
                                    left: pixel[0] + 'px',
                                    top: (pixel[1] - 15) + 'px'
                                });
                                var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                                    return feature;
                                });
                                if (feature) {
                                    info.tooltip('hide')
                                        .attr('data-original-title', feature.get('name'))
                                        .tooltip('fixTitle')
                                        .tooltip('show');
                                } else {
                                    info.tooltip('hide');
                                }
                            };

                            $(map.getViewport()).on('mousemove', function (evt) {
                                displayFeatureInfo(map.getEventPixel(evt.originalEvent));
                            });

                            map.on('click', function (evt) {
                                displayFeatureInfo(evt.pixel);
                            });
                        }
                    }

                    $scope.$watch('entities', function (newVal) {
                        if (newVal) {
                            update(newVal);
                        }
                    });

                    create();
                },
                restrict: 'E',
                template: '<div class="os-maps"><div class="info"></div></div>',
                replace: true
            }
        }]);
});