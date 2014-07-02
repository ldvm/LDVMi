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
            "angular-resource": "/webjars/angularjs/1.2.18/angular-resource.min"
        }
    });

    requirejs.onError = function (err) {
        console.log(err);
    };
})(requirejs);