define(['angular', 'underscorejs', './filters'], function (ng, _) {
    'use strict';

    ng.module('ldvm.filters')
        .filter('label', ['Visualization', function (visualizations) {
            return function (labelledObject, languageCode, availableLanguages, disableUriFallback) {

                if (!labelledObject) {
                    return null;
                }

                labelledObject.label = labelledObject.label || {variants: {}};
                labelledObject.label.variants = labelledObject.label.variants || {};

                var label = labelledObject.label;

                // current language needs to be always the first one
                var languages = _.without(availableLanguages, languageCode);
                languages.unshift(languageCode);
                if (languageCode != 'nolang') {
                    languages.push('nolang');
                }

                for (var l in languages) {
                    var code = languages[l];
                    if (label.variants[code]) {
                        return label.variants[code];
                    }
                }

                var uri = labelledObject.uri;

                if (uri) {
                    if (!label.dereferenced) {
                        visualizations.dereference(uri).then(function (data) {
                            label.variants = _.extend(label.variants, data.variants);
                        });
                        label.dereferenced = 1;
                    }
                    if (!disableUriFallback) {
                        return uri;
                    }
                }

                return 'No label';
            };
        }]);
});