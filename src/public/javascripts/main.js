(function (requirejs) {
    "use strict";

    requirejs.config({
        shim: {
            "jquery": {
                exports: "$"
            },
            "angular": {
                exports: "angular"
            }
        },
        paths: {
            "lib": "lib",
            "angular": "/webjars/angularjs/1.2.18/angular.min",
            "domReady": "/webjars/requirejs-domready/2.0.1/domReady",
            "angular-resource": "/webjars/angularjs/1.2.18/angular-resource.min",
            "angular-route": "/webjars/angularjs/1.2.18/angular-route.min",
            "angular-ui": "/webjars/angular-ui/0.4.0/angular-ui.min",
            "ui.bootstrap": "/webjars/angular-ui-bootstrap/0.11.0/ui-bootstrap.min",
            "angular-loading-bar": "/webjars/angular-loading-bar/0.4.3/loading-bar.min"
        }
    });

    requirejs.onError = function (err) {
        console.log(err);
    };
})(requirejs);