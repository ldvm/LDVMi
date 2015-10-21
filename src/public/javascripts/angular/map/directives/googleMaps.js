define(['angular', 'bootstrap', './directives'], function (ng) {
    'use strict';

    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) < 0;
        });
    };

    ng.module('map.directives')
        .directive('googleMaps', [function () {
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

                        var markersToShow = [];
                        var markersToHide = [];

                        angular.forEach($scope.markerData, function (item) {

                            var coords = item.coordinates;
                            var marker;

                            // REUSE OR CREATE
                            if ($scope.markersMap[coords.lat] && $scope.markersMap[coords.lat][coords.lng]) {
                                marker = $scope.markersMap[coords.lat][coords.lng];
                            } else {
                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(coords.lat, coords.lng),
                                    title: $scope.getTitle(item)
                                });
                            }

                            markersToShow.push(marker);

                            // BOUNDS, REMEMBERING MARKERS
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

                        $scope.clusterer.clearMarkers();
                        $scope.clusterer.addMarkers(markersToShow);

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
                link: function ($scope, $elm) {

                    var center = $scope.center || {lat: 49, lng: 15};
                    var options = {
                        center: new google.maps.LatLng(center.lat, center.lng),
                        zoom: parseInt($scope.zoom) || 1,
                        mapTypeId: $scope.mapType || google.maps.MapTypeId.ROADMAP
                    };
                    $scope.map = new google.maps.Map($elm[0], options);

                    var clustererOptions = {gridSize: 50, maxZoom: 15};
                    $scope.clusterer = new MarkerClusterer(map, [], clustererOptions);

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
        }]);
});