define(['./app'], function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: '/assets/javascripts/angular/datacube/partials/datacube.html', controller: 'DataCube', reloadOnSearch: false});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

});