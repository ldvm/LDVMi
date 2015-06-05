define(['angular', './filters'], function (ng) {
    'use strict';

    ng.module('ldvm.filters')
        .filter('label', [function(){
            return function(resource, languageCode) {

                languageCode = languageCode || "nolang";

                if(resource.label && resource.label.variants){
                    if(languageCode in resource.label.variants){
                        return resource.label.variants[languageCode];
                    }
                    if('nolang' in resource.label.variants){
                        return resource.label.variants['nolang'];
                    }
                }

                return resource.uri || "Not identified";
            };
        }]);
});