define(['angular', '../websocket', '../models/models'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers', ['ldvm.models', 'ldvm.websocket']);
});