define(['angular'], function (ng) {
    'use strict';

    ng.module('ldvm.utils', [])
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
});
