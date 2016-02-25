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
                    makePermanent: function(id){
                        return componentsApi.makePermanent({id: id}).$promise;
                    }
                };
            }
        ]);

});
