define(['angular', './filters'], function (ng) {
    'use strict';

    ng.module('ldvm.filters')
        .filter('label', [function () {
            return function (resource, languageCode, disableUriFallback) {

                if (!resource) {
                    return "";
                }

                var langCodes = ['nolang', 'cs', 'en'];
                disableUriFallback = !!disableUriFallback;

                if (languageCode) {
                    langCodes.unshift(languageCode);
                }

                if (resource && 'label' in resource && 'variants' in resource.label) {
                    for (var k in langCodes) {
                        var langCode = langCodes[k];
                        if (langCode in resource.label.variants) {
                            return resource.label.variants[langCode];
                        }
                    }
                }

                if (disableUriFallback) {
                    return 'No label';
                }

                return resource.uri || 'Not identified';
            };
        }]);
});