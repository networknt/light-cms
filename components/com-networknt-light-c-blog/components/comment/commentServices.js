'use strict';
angular.module('lightApp')
.provider('commentsConfig', function() {
    var config = {
        containerTemplate: 'components/comment/comments.html',
        commentTemplate: 'components/comment/comment.html',
        orderBy: 'best',
        commentController: 'commentCtrl',
        depthLimit: 3
    };

    var emptyController = function() {};

    function stringSetter(setting, value) {
        if (typeof value === 'string') {
            config[setting] = value;
        }
    }
    function controllerSetter(setting, value) {
        if (value && (angular.isString(value) && value.length ||
            angular.isFunction(value) ||
            angular.isArray(value))) {
            config[setting] = value;
        } else {
            config[setting] = emptyController;
        }
    }
    function numberSetter(setting, value) {
        if (typeof value === 'number') {
            config[setting] = value;
        }
    }

    var setters = {
        'containerTemplate': stringSetter,
        'commentTemplate': stringSetter,
        'orderBy': stringSetter,
        'commentController': controllerSetter,
        'depthLimit': numberSetter
    };
    this.$get = function() {
        return config;
    };
    this.set = function(name, value) {
        var fn, key, props, i;
        if (typeof name === 'string') {
            fn = setters[name];
            if (fn) {
                fn(name, value);
            }
        } else if (typeof name === 'object') {
            props = Object.keys(name);
            for(i=0; i<props.length; ++i) {
                key = props[i];
                fn = setters[key];
                if (fn) {
                    fn(key, name[key]);
                }
            }
        }
    };
});