define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('payola.api', ['ngResource'])
        .factory('PipelineApi', ['$resource', function ($resource) {
            return $resource('/api/v1/pipelines', null, {
                query: {url: '/api/v1/pipelines', isArray: false},
                get: {url: '/api/v1/pipelines/:id', isArray: false},
                add: {url: '/api/v1/pipelines/ttl', isArray: false},
                visualization: {url: '/api/v1/pipelines/visualization/:id', isArray: false},
                discover: {url: '/api/v1/pipelines/discover', isArray: false}
            });
        }])
        .factory('DatasourceApi', ['$resource', function ($resource) {
            return $resource('/api/v1/visualization', null, {
                add: {url: '/api/v1/visualization/add-datasource', isArray: false}
            });
        }])
        .factory('CompatibilityApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                get: {url: '/api/v1/compatibility/:id', isArray: true},
                check: {url: '/api/v1/compatibility/check/:id', isArray: true}
            });
        }]);

    ng.module('payola.utils', [])
        .service('PaginationUtils', [function () {
            return {
                buildQuery: function (page, pageSize) {
                    return {
                        skip: ((page - 1) * pageSize),
                        take: pageSize
                    };
                }
            };
        }]);

    ng.module('pipeline.model', ['payola.api', 'payola.utils'])
        .service('Pipelines', [
            'PipelineApi',
            'PaginationUtils',
            function (pipelineApi,
                      paginationUtils) {
                return {
                    findPaginated: function (page, pageSize, filters) {
                        var query = paginationUtils.buildQuery(page, pageSize);
                        ng.extend(query,filters);
                        return pipelineApi.query(query).$promise;
                    },
                    visualization: function (id) {
                        return pipelineApi.visualization({id: id}).$promise;
                    },
                    discover: function () {
                        return pipelineApi.discover().$promise;
                    }
                };
            }
        ]);

    ng.module('websocket', [])
        .service('$connection', ["$q", "$timeout", "$rootScope", function ($q, $timeout, $rootScope) {
            return function (websocketUrl) {

                var me = {};
                var listeners = [];
                var oneListeners = [];

                me.isConnected = false;

                oneListeners.removeOne = function (listener) {
                    var index = oneListeners.indexOf(listener);
                    if (index != -1)
                        oneListeners.splice(index, 1);
                };

                var correlationId = 1;
                me.nextCorrelationId = function () {
                    return correlationId++;
                };

                $rootScope.queuedMessages = [];

                me.listen = function (predicate, handler) {
                    listeners.push({p: predicate, h: handler});
                };

                me.listenOnce = function (predicate, timeout) {
                    var deferred = $q.defer();
                    deferred.done = false;
                    var listener = {d: deferred, p: predicate};
                    oneListeners.push(listener);
                    if (timeout) {
                        $timeout(function () {
                            if (!deferred.done)
                                deferred.reject('timeout');
                            oneListeners.removeOne(listener);
                        }, timeout);
                    }
                    var promise = deferred.promise;
                    promise.then(function (data) {
                        deferred.done = true;
                    });
                    return promise;
                };

                var onOpen = function () {
                    $rootScope.websocketAvailable = true;
                    me.isConnected = true;
                    $rootScope.$$phase || $rootScope.$apply();
                    if ($rootScope.queuedMessages) {
                        for (var i = 0; i < $rootScope.queuedMessages.length; i++) {
                            ws.send(JSON.stringify($rootScope.queuedMessages[i]));
                        }
                        $rootScope.queuedMessages = null;
                        $rootScope.$$phase || $rootScope.$apply();
                    }
                };

                var onClose = function () {
                    me.isConnected = false;
                    $rootScope.websocketAvailable = false;
                    $rootScope.$$phase || $rootScope.$apply();
                    $rootScope.queuedMessages = $rootScope.queuedMessages || [];

                    /*
                    setTimeout(function () {
                        ws = connect();
                    }, 5000);*/
                };

                var onMessage = function (msg) {
                    var obj = JSON.parse(msg.data);
                    
                    for (var i = 0; i < listeners.length; i++) {
                        var listener = listeners[i];
                        if (listener.p(obj))
                            listener.h(obj);
                    }
                    var remove = [];
                    for (var i = 0; i < oneListeners.length; i++) {
                        var listener = oneListeners[i];
                        if (listener.p(obj)) {
                            var o = obj;
                            listener.d.resolve(o);
                            remove.push(listener);
                        }
                    }
                    for (var i = 0; i < remove.length; i++) {
                        oneListeners.removeOne(remove[i]);
                    }
                };

                var onError = function () {
                    
                };

                me.send = function (obj) {

                    if ($rootScope.queuedMessages)
                        $rootScope.queuedMessages.push(obj);
                    else
                        ws.send(JSON.stringify(obj));
                };

                var setHandlers = function (w) {
                    w.onopen = onOpen;
                    w.onclose = onClose;
                    w.onmessage = onMessage;
                    w.onerror = onError;
                };

                var connect = function () {
                    
                    var w = new WebSocket(websocketUrl);
                    setHandlers(w);
                    return w;
                };

                var ws = connect();

                return me;
            };
        }]);
});
