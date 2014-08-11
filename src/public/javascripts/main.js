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
            }
        },
        paths: {
            "lib": "lib",
            "angular": "/webjars/angularjs/1.2.18/angular",
            "highcharts": "/webjars/highcharts/4.0.3/highcharts-all",
            "domReady": "/webjars/requirejs-domready/2.0.1/domReady",
            "angular-resource": "/webjars/angularjs/1.2.18/angular-resource",
            "angular-route": "/webjars/angularjs/1.2.18/angular-route",
            "angular-ui": "/webjars/angular-ui/0.4.0/angular-ui",
            "highcharts-ng": "/webjars/highcharts-ng/0.0.6/highcharts-ng",
            "ui.bootstrap": "/webjars/angular-ui-bootstrap/0.11.0/ui-bootstrap",
            "angular-loading-bar": "/webjars/angular-loading-bar/0.4.3/loading-bar",
            "underscore": "/webjars/underscorejs/1.6.0/underscore"
        }
    });

    requirejs.onError = function (err) {
        console.log(err);
    };
})(requirejs);