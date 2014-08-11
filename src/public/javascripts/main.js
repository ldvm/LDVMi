(function (requirejs) {
    "use strict";

    requirejs.config({
        shim: {
            "jquery": {
                exports: "$"
            },
            "angular": {
                exports: "angular"
            },
            "underscore": {
                exports: "_"
            },
            "ngResource": {
                deps: ['angular'],
                exports: 'angular'
            },
            "ngRoute": {
                deps: ['angular'],
                exports: 'angular'
            },
            "ngUi": {
                deps: ['angular'],
                exports: 'angular'
            },
            "ngLoadingBar": {
                deps: ['angular'],
                exports: 'angular'
            },
            "ngHighcharts": {
                deps: ['angular'],
                exports: 'angular'
            },
            "ui.bootstrap": {
                deps: ['angular'],
                exports: 'angular'
            }
        },
        paths: {
            "lib": "lib",
            "angular": "/webjars/angularjs/1.2.18/angular",
            "highcharts": "/webjars/highcharts/4.0.3/highcharts-all",
            "domReady": "/webjars/requirejs-domready/2.0.1/domReady",
            "ngResource": "/webjars/angularjs/1.2.18/angular-resource",
            "ngRoute": "/webjars/angularjs/1.2.18/angular-route",
            "ngUi": "/webjars/angular-ui/0.4.0/angular-ui",
            "ngHighcharts": "/webjars/highcharts-ng/0.0.6/highcharts-ng",
            "ui.bootstrap": "/webjars/angular-ui-bootstrap/0.11.0/ui-bootstrap",
            "ngLoadingBar": "/webjars/angular-loading-bar/0.4.3/loading-bar",
            "underscore": "/webjars/underscorejs/1.6.0/underscore"
        }
    });

    requirejs.onError = function (err) {
        console.log(err);
    };
})(requirejs);