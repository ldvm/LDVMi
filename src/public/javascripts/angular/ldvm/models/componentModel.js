define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Components', [
            'ComponentsApi',
            function (componentsApi) {
                return {
                    createSparqlEndpoints: function (data) {
                        return componentsApi.createSparqlEndpoints(data).$promise;
                    },
                    createFromUrls: function (urls) {
                        return componentsApi.createFromUrls(urls).$promise;
                    },
                    makePermanent: function (id) {
                        return componentsApi.makePermanent({id: id}).$promise;
                    }
                };
            }
        ]);

});
