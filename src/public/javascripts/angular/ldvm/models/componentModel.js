define(['angular', 'underscorejs', './models'], function (ng, _) {
    'use strict';

    ng.module('ldvm.models')
        .service('Components', [
            '$q',
            'ComponentsApi',
            function ($q, componentsApi) {
                return {
                    createSparqlEndpoints: function (data) {
                        return componentsApi.createSparqlEndpoints(data).$promise;
                    },
                    createFromUrls: function (urls) {
                        return componentsApi.createFromUrls(urls).$promise;
                    },
                    makePermanent: function (id) {
                        return componentsApi.makePermanent({id: id}).$promise;
                    },
                    createByFileUpload: function (dataArray) {
                        return componentsApi.createByFileUpload(dataArray).$promise;
                    },
                    isValidDataSource: function (source) {

                        function isValidSparqlEndpoint(source) {
                            return source.endpointUrl && source.endpointUrl.length > "http://".length;
                        }

                        function isValidUrl(source) {
                            return source.url && source.url.length > "http://".length;
                        }

                        function isValidFileUpload(source) {
                            return source.files && source.files.length;
                        }

                        switch (source.type) {
                            case 'sparqlEndpoint':
                                return isValidSparqlEndpoint(source);
                            case 'url':
                                return isValidUrl(source);
                            case 'file':
                                return isValidFileUpload(source);
                        }

                        return false;
                    },
                    createDataSource: function (source) {

                        var self = this;

                        function createSparqlEndpoints(source) {
                            var sourcesForApi = [{
                                endpointUrl: source.endpointUrl,
                                graphUris: source.graphUris ? source.graphUris.split(/\s+/).map(urlTrim) : undefined
                            }];

                            return self.createSparqlEndpoints(sourcesForApi);
                        }

                        function createFromUrl(source) {
                            var urls = source.url ? source.url.split(/\s+/).map(urlTrim) : undefined;
                            return self.createFromUrls(urls);
                        }

                        function createByFileUpload(source) {
                            return self.createByFileUpload(source.files);
                        }

                        switch (source.type) {
                            case 'sparqlEndpoint':
                                return createSparqlEndpoints(source);
                            case 'url':
                                return createFromUrl(source);
                            case 'file':
                                return createByFileUpload(source);
                        }
                    },
                    createDataSources: function (sources) {
                        var self = this;

                        var deferred = $q.defer();
                        var validDataSources = _.filter(sources, function (source) {
                            return self.isValidDataSource(source);
                        });

                        if (validDataSources.length === 0) {
                            deferred.reject('No valid data sources given.');
                        } else {
                            var promises = _.map(validDataSources, function (dataSource) {
                                return self.createDataSource(dataSource);
                            });

                            $q.all(promises).then(function (data) {
                                var dataSourceIds = _.flatten(data).map(function (d) {
                                    return d.id;
                                });
                                deferred.resolve({validSources: validDataSources, sourcesIds: dataSourceIds});
                            });
                        }

                        return deferred.promise;
                    }
                };
            }
        ]);

    function urlTrim(str) {
        return trim(str, '\n\r\t "\',;');
    }

    var trim = (function () {
        "use strict";

        function escapeRegex(string) {
            return string.replace(/[\[\](){}?*+\^$\\.|\-]/g, "\\$&");
        }

        return function trim(str, characters, flags) {
            flags = flags || "g";
            if (typeof str !== "string" || typeof characters !== "string" || typeof flags !== "string") {
                throw new TypeError("argument must be string");
            }

            if (!/^[gi]*$/.test(flags)) {
                throw new TypeError("Invalid flags supplied '" + flags.match(new RegExp("[^gi]*")) + "'");
            }

            characters = escapeRegex(characters);

            return str.replace(new RegExp("^[" + characters + "]+|[" + characters + "]+$", flags), '');
        };
    }());

});
