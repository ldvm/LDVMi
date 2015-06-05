define(['angular'], function (ng) {
    'use strict';

    ng.module('ldvm.websocket', [])
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
