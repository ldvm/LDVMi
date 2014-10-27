define(['./app'], function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {

        var partialsPath = '/assets/javascripts/angular/visualization/partials/';

        $routeProvider.when('/list', {templateUrl: partialsPath + 'list.html', controller: 'List', reloadOnSearch: false});
        $routeProvider.when('/', {templateUrl: partialsPath + 'index.html', controller: 'Add', reloadOnSearch: false});
        $routeProvider.when('/add', {templateUrl: partialsPath + 'add.html', controller: 'Add', reloadOnSearch: false});
        $routeProvider.when('/:page', {templateUrl: partialsPath + 'list.html', controller: 'List', reloadOnSearch: false});
        $routeProvider.when('/compatibility/:command/:id', {templateUrl: partialsPath + 'compatibility.html', controller: 'Compatibility', reloadOnSearch: false});
        $routeProvider.when('/compatibility/:id', {templateUrl: partialsPath + 'compatibility.html', controller: 'Compatibility', reloadOnSearch: false});
        $routeProvider.otherwise({redirectTo: '/'});
    }])
        .config(function ($provide) {
            $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
                return function (exception, cause) {
                    alert("Unexpected error.");
                    $delegate(exception, cause);
                };
            });

        })
        .factory('errorHttpInterceptor', ['$q', function ($q, $modal) {
            return {
                responseError: function responseError(rejection) {

                    alert("Communication with server failed.");
                    return $q.reject(rejection);
                }
            };
        }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('errorHttpInterceptor');
        }])
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.latencyThreshold = 0;
        }]);
});