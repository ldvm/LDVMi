define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Visualization', [
            'SkosApi',
            'DataCubeApi',
            function (skosApi,
                      dataCubeApi) {
                return {
                    skos: {
                        schemes: function (id, tolerant) {
                            return skosApi.schemes({id: id, tolerant: !!tolerant}).$promise;
                        },
                        scheme: function (id, uri) {
                            return skosApi.scheme({id: id, schemeUri: uri}).$promise;
                        },
                        concepts: function (id, tolerant) {
                            return skosApi.concepts({id: id, tolerant: !!tolerant}).$promise;
                        },
                        create: function (dataSourceTemplateId) {
                            return skosApi.create({id: dataSourceTemplateId}).$promise;
                        }
                    },
                    dataCube: {
                        create: function (dataSourceTemplateId) {
                            return dataCubeApi.create({id: dataSourceTemplateId}).$promise;
                        },
                        dataStructures: function (id) {
                            return dataCubeApi.dataStructures({id: id}).$promise;
                        },
                        dataStructureComponents: function (id, uri, isTolerant) {
                            isTolerant = !!isTolerant;
                            return dataCubeApi.dataStructureComponents({id: id, uri: uri, isTolerant: isTolerant}).$promise;
                        }
                    }
                };
            }]);

});
