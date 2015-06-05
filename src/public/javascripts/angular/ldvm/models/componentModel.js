define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Components', [
            'ComponentsApi',
            function (componentsApi) {
                return {
                    createDatasource: function (data) {
                        return componentsApi.createDatasource(data).$promise;
                    }
                };
            }
        ]);

});
