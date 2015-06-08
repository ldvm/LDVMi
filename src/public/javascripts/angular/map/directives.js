define(['angular', 'jquery', 'bootstrap'], function (ng, $, proj4) {
    'use strict';

    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) < 0;
        });
    };

    ng.module('map.directives', [])
        .directive('gmaps', [function () {
            return {
                scope: {
                    markerData: '=markers',
                    mapType: '@',
                    zoom: '=',
                    center: '=',
                    zoomChangedListener: '&zoomChanged',
                    centerChangedListener: '&centerChanged',
                    boundsChangedListener: '&boundsChanged',
                    fitBounds: '='
                },
                controller: function ($scope) {

                    $scope._gMarkers = [];
                    $scope.markersMap = {};

                    $scope.getTitle = function (item) {
                        var t = "";
                        if (item.title) {
                            t += item.title;
                        }
                        return t;
                    };

                    $scope.zoomChanged = function (zoomLevel) {
                        $scope.zoomChangedListener = $scope.zoomChangedListener || ng.noop;
                        $scope.zoomChangedListener({zoom: zoomLevel});
                    };

                    $scope.centerChanged = function (center) {
                        $scope.centerChangedListener = $scope.centerChangedListener || ng.noop;
                        $scope.centerChangedListener({center: {lat: center.lat(), lng: center.lng()}});
                    };

                    $scope.boundsChanged = function (bounds) {
                        $scope.boundsChangedListener = $scope.boundsChangedListener || ng.noop;
                        var ne = bounds.getNorthEast();
                        var sw = bounds.getSouthWest();
                        $scope.boundsChangedListener({
                            bounds: {
                                northEast: {lat: ne.lat(), lng: ne.lng()},
                                southWest: {lat: sw.lat(), lng: sw.lng()}
                            }
                        });
                    };

                    $scope.updateMarkers = function () {

                        if (!$scope.markerData) {
                            return;
                        }

                        var newMarkersMap = {};
                        var newMarkers = [];
                        $scope.bounds = new google.maps.LatLngBounds();

                        angular.forEach($scope.markerData, function (item) {

                            var coords = item.coordinates;
                            var marker;

                            // REUSE OR CREATE
                            if ($scope.markersMap[coords.lat] && $scope.markersMap[coords.lat][coords.lng]) {
                                marker = $scope.markersMap[coords.lat][coords.lng];
                                marker.setMap($scope.map);
                            } else {
                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(coords.lat, coords.lng),
                                    map: $scope.map,
                                    title: $scope.getTitle(item)
                                });
                            }

                            // BOUNDS, REMEBERING MARKERS
                            newMarkersMap[coords.lat] = newMarkersMap[coords.lat] || {};
                            newMarkersMap[coords.lat][coords.lng] = marker;
                            newMarkers.push(marker);
                            $scope.bounds.extend(marker.position);

                            // INFO WINDOW
                            var contentString = '<p>' + ((item.description) || "").replace(/\n/g, "<br />") + '</p>';

                            google.maps.event.addListener(marker, 'click', function (content) {
                                return function () {
                                    $scope.infowindow.setContent(content);//set the content
                                    $scope.infowindow.open($scope.map, this);
                                }
                            }(contentString));
                        });

                        var hideMarkers = $scope._gMarkers.diff(newMarkers);

                        angular.forEach(hideMarkers, function (m) {
                            m.setMap(null);
                        });

                        $scope._gMarkers = newMarkers;

                        $scope.markersMap = newMarkersMap;

                        if ($scope.fitBounds === true) {
                            $scope.map.fitBounds($scope.bounds);
                        }

                        $scope.boundsChanged($scope.bounds);
                    };

                    $scope.updateZoom = function (newZoom) {
                        $scope.map.setZoom(newZoom || $scope.zoom || 5);
                    };

                    $scope.updateCenter = function () {
                        var center = $scope.center || {lat: 49, lng: 15};
                        $scope.map.setCenter(new google.maps.LatLng(center.lat || 49, center.lng || 15));
                    };

                    $scope.$watch('markerData', function () {
                        $scope.updateMarkers();
                    });

                    $scope.$watch('zoom', function (newZoom) {
                        $scope.updateZoom(newZoom);
                    });

                    $scope.$watch('center', function () {
                        $scope.updateCenter();
                    });

                },
                link: function ($scope, $elm, $attrs) {

                    var center = $scope.center || {lat: 49, lng: 15};

                    $scope.map = new google.maps.Map($elm[0], {
                        center: new google.maps.LatLng(center.lat, center.lng),
                        zoom: parseInt($scope.zoom) || 1,
                        mapTypeId: $scope.mapType || google.maps.MapTypeId.ROADMAP
                    });

                     google.maps.event.addListener($scope.map, 'zoom_changed', function () {
                     $scope.zoomChanged($scope.map.getZoom());
                     });

                     google.maps.event.addListener($scope.map, 'center_changed', function () {
                     $scope.centerChanged($scope.map.getCenter());
                     });

                     google.maps.event.addListener($scope.map, 'bounds_changed', function () {
                     $scope.boundsChanged($scope.map.getBounds());
                     });

                     $scope.infowindow = new google.maps.InfoWindow();
                },
                restrict: 'E',
                template: '<div class="gmaps" style="margin-top: -30px;"></div>',
                replace: true
            }
        }])

        .directive('osm', [function () {
            return {
                scope: {
                    entities: '=',
                    colors: '='
                },
                controller: function ($scope) {

                    $scope.colors = $scope.colors || {};

                    function color(value) {
                        if (!$scope.colors[value]) {
                            $scope.colors[value] = "rgba(0, 0, 0, 0.6)";
                        }
                        return $scope.colors[value];
                    }

                    $scope.updateMap = function (entities) {
                        var format = new ol.format.WKT();
                        var features = [];

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

                        ng.forEach(entities, function (e) {
                            var feature = format.readFeature(e.wkt);

                            var prj = new ol.proj.Projection({code:'EPSG:4326'});
                            var geom = feature.getGeometry();
                            geom.transform(prj, 'EPSG:3857');
                            var coordinates = geom.getCoordinates();
                            coordinates = swap(coordinates);
                            geom.setCoordinates(coordinates);
                            feature.color = color(e.groupPropertyValue);

                            if (e.title) {
                                feature.set('name', e.title.variants["sl"]);
                            }
                            features.push(feature);
                        });

                        if ($scope.vector && $scope.map) {
                            $scope.map.removeLayer($scope.vector);
                        }

                        var source = new ol.source.Vector({
                            features: features
                        });

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
                        });

                        if ($scope.map) {
                            $scope.map.addLayer($scope.vector);

                            var extent = source.getExtent();
                            $scope.map.getView().fitExtent(extent, $scope.map.getSize());

                            var selectMouseMove = new ol.interaction.Select({
                                condition: ol.events.condition.mouseMove
                            });
                            $scope.map.addInteraction(selectMouseMove);

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
                                var feature = $scope.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
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

                            $($scope.map.getViewport()).on('mousemove', function (evt) {
                                displayFeatureInfo($scope.map.getEventPixel(evt.originalEvent));
                            });

                            $scope.map.on('click', function (evt) {
                                displayFeatureInfo(evt.pixel);
                            });
                        }
                    };

                    $scope.$watch('entities', function (newVal) {
                        if (newVal) {
                            $scope.updateMap(newVal);
                        }
                    });

                    if ($scope.entities) {
                        $scope.updateMap($scope.entities);
                    }
                },
                link: function ($scope, $elm) {

                    var raster = new ol.layer.Tile({
                        source: new ol.source.OSM()
                    });

                    $scope.map = new ol.Map({
                        layers: [raster],
                        target: $elm[0],
                        view: new ol.View({
                            center: [0, 0],
                            zoom: 1
                        }),
                        interactions: ol.interaction.defaults().extend([
                            new ol.interaction.DragRotateAndZoom()
                        ])
                    });

                    var zoomslider = new ol.control.ZoomSlider();
                    $scope.map.addControl(zoomslider);

                    $scope.el = $elm;
                },
                restrict: 'E',
                template: '<div class="os-maps"><div class="info"></div></div>',
                replace: true
            }
        }]);
});