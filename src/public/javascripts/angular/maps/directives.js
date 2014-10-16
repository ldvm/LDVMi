define(['angular', 'openlayers'], function (ng, ol) {
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
                    polygonData: '=polygons',
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
                        $scope.zoomChangedListener = $scope.zoomChangedListener || function () {
                        };
                        $scope.zoomChangedListener({zoom: zoomLevel});
                    };

                    $scope.centerChanged = function (center) {
                        $scope.centerChangedListener = $scope.centerChangedListener || function () {
                        };
                        $scope.centerChangedListener({center: {lat: center.lat(), lng: center.lng()}});
                    };

                    $scope.boundsChanged = function (bounds) {
                        $scope.boundsChangedListener = $scope.boundsChangedListener || function () {
                        };
                        var ne = bounds.getNorthEast();
                        var sw = bounds.getSouthWest();
                        $scope.boundsChangedListener({
                            bounds: {
                                northEast: {lat: ne.lat(), lng: ne.lng()},
                                southWest: {lat: sw.lat(), lng: sw.lng()}
                            }
                        });
                    };

                    $scope.updatePolygons = function () {
                        angular.forEach($scope.polygonData, function (entity) {
                            angular.forEach(entity.polygons, function (polygon) {
                                var mapPolygon = new google.maps.Polygon({
                                    paths: polygon.points,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35
                                });

                                mapPolygon.setMap($scope.map);
                            });
                        });
                    };

                    $scope.updateMarkers = function () {

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
                            var contentString = '<p>' + item.description.replace(/\n/g, "<br />") + '</p>';

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

                    $scope.updateZoom = function () {
                        $scope.map.setZoom($scope.zoom || 0);
                    };

                    $scope.updateCenter = function () {
                        var center = $scope.center || {lat: 0, lng: 0};
                        $scope.map.setCenter(new google.maps.LatLng(center.lat || 0, center.lng || 0));
                    };

                    $scope.$watch('markerData', function () {
                        $scope.updateMarkers();
                    });

                    $scope.$watch('polygonData', function () {
                        $scope.updatePolygons();
                    });

                    $scope.$watch('zoom', function () {
                        $scope.updateZoom();
                    });

                    $scope.$watch('center', function () {
                        $scope.updateCenter();
                    });

                },
                link: function ($scope, $elm, $attrs) {

                    var center = $scope.center || {lat: 0, lng: 0};

                    $scope.map = new google.maps.Map($elm[0], {
                        center: new google.maps.LatLng(center.lat, center.lng),
                        zoom: parseInt($scope.zoom) || 0,
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
                template: '<div class="gmaps"></div>',
                replace: true
            }
        }])

        .directive('osm', [function () {
            return {
                scope: {
                    polygons: '='
                },
                controller: function ($scope) {

                    $scope.updateMap = function (polygons) {
                        var format = new ol.format.WKT();
                        var features = [];
                        ng.forEach(polygons, function (p) {
                            var feature = format.readFeature(p.wkt);
                            feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
                            features.push(feature);
                        });

                        if ($scope.vector && $scope.map) {
                            $scope.map.removeLayer($scope.vector);
                        }

                        var source = new ol.source.Vector({
                            features: features
                        });

                        $scope.vector = new ol.layer.Vector({
                            source: source
                        });

                        if ($scope.map) {
                            $scope.map.addLayer($scope.vector);

                            var extent = source.getExtent();
                            $scope.map.getView().fitExtent(extent, $scope.map.getSize());
                        }
                    };

                    $scope.$watch('polygons', function (newVal) {
                        if (newVal) {
                            $scope.updateMap(newVal);
                        }
                    });

                    if ($scope.polygons) {
                        $scope.updateMap($scope.polygons);
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
                        })
                    });
                },
                restrict: 'E',
                template: '<div class="os-maps"></div>',
                replace: true
            }
        }]);
});