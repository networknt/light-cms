'use strict';

angular.module('lightApp')
    .constant('CLIENT', {
        'clientId': 'example@Browser'
    })
    .factory('base64', function() {
        return {
            // This is used to parse the profile.
            base64Decode: function(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
            }
        };
    })
    .service('modelDataService', function() {
        var modelData = null;
        return {
            setModelData : function (data) {
                modelData = data;
            },
            getModelData : function () {
                return modelData;
            }
        };
    })
    .factory('authInterceptorService', ['$q', '$injector','$location', 'httpBuffer', 'localStorageService','toaster', function ($q, $injector, $location, httpBuffer, localStorageService, toaster) {

        var authInterceptorServiceFactory = {};
        var $http;

        var _request = function (config) {
            config.headers = config.headers || {};
            var authorizationData = localStorageService.get('authorizationData');
            //console.log('config', config);
            // TODO Do not put access token into header of refresh token post. In this case,
            // we don't need to remove the authorizationData before sending refresh token post.
            // chances are some other requests might be sent during the time slot and got login
            // is required error and forced to login page.
            // TODO I really don't like this checking. need to find another way? backend?
            if (authorizationData) {
                if(angular.isDefined(config.data) && angular.isDefined(config.data.name) && config.data.name === 'refreshToken') {
                    return config;
                }
                config.headers.Authorization = 'Bearer ' + authorizationData.token;
            }
            return config;
        }

        var _responseError = function (rejection) {
            console.log("responseError: rejection", rejection);
            var deferred = $q.defer();
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                if(rejection.data === 'token_expired') {
                    console.log("token expired, renewing...")
                    httpBuffer.append(rejection.config, deferred);
                    console.log("rejection and deferred are added to httpBuffer", rejection, deferred);
                    authService.refreshToken().then(function (response) {
                        console.log("_responseError: successfully called refreshToken");
                        // the updater function will put the renewed token into header of saved requests.
                        httpBuffer.retryAll(function(config) {
                            config.headers = config.headers || {};
                            var authorizationData = localStorageService.get('authorizationData');
                            if (authorizationData) {
                                config.headers.Authorization = 'Bearer ' + authorizationData.token;
                            }
                            return config;
                        });
                    }, function () {
                        // failed to get refresh token somehow. Maybe didn't check remember me. go to login page.
                        toaster.pop('error', rejection.status, rejection.data, 5000);
                        console.log("_responseError failed to get refresh token. Maybe didn't check remember me");
                        // abandon all the saved requests
                        httpBuffer.rejectAll();
                        httpBuffer.saveAttemptUrl();
                        authService.logOut();
                        $location.path('/signin');
                        deferred.reject(rejection);
                    });
                } else {
                    // 401 but not token expired the user is not logged in yet.
                    toaster.pop('error', rejection.status, rejection.data, 5000);
                    httpBuffer.rejectAll();
                    httpBuffer.saveAttemptUrl();
                    $location.path('/signin');
                    deferred.reject(rejection);
                }
            } else if (rejection.status === 403) {
                // 403 forbidden. The user is logged in but doesn't have permission for the request.
                // logout and redirect to login page.
                toaster.pop('error', rejection.status, rejection.data, 5000);
                httpBuffer.rejectAll();
                httpBuffer.saveAttemptUrl();
                authService.logOut();
                $location.path('/signin');
                deferred.reject(rejection);
            } else if (rejection.status === 404) {
                // 404 not found. don't do anything here just let it go. as the controller might try
                // some other ways to get the resource. eg. PageCtrl load from file system first and
                // then try REST API second for development.
                deferred.reject(rejection);
            } else {
                // some other errors, reject immediately.
                toaster.pop('error', rejection.status, rejection.data, 5000);
                deferred.reject(rejection);
            }
            return deferred.promise;
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }])
    .factory('authService', ['$q', '$injector', 'localStorageService', 'base64', 'CLIENT', function ($q, $injector, localStorageService, base64, CLIENT) {

        var $http;
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            useRefreshTokens: false,
            currentUser: { userId: '', roles: ['anonymous']}
        };

        var _logOut = function () {
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.currentUser = { userId: '', roles: ['anonymous']};
            _authentication.useRefreshTokens = false;
        };

        var _fillAuthData = function () {
            var authorizationData = localStorageService.get('authorizationData');
            console.log('_fillAuthData:authorizationData', authorizationData);
            if (authorizationData) {
                _authentication.isAuth = true;
                _authentication.useRefreshTokens = authorizationData.useRefreshTokens;
                _authentication.currentUser = authorizationData.currentUser;
            }
        };

        var _getRefreshToken = function () {
            var authorizationData = localStorageService.get('authorizationData');
            return authorizationData.refreshToken;
        }

        var _refreshToken = function ()
        {
            var deferred = $q.defer();

            var refreshTokenPost = {
                category : 'user',
                name : 'refreshToken',
                readOnly: true
            };

            var authorizationData = localStorageService.get('authorizationData');
            console.log("authService:_refreshToken:authorizationData before refresh", authorizationData);
            if (authorizationData && authorizationData.useRefreshTokens) {
                refreshTokenPost.data = {refreshToken : authorizationData.refreshToken, userId: authorizationData.currentUser.userId, clientId: CLIENT.clientId};
                // The authorizationData must be removed before calling refreshToken api as the old expired token will be sent again
                // and cause infinite loop. Once it is removed, not access token will be sent to the server along with the request.
                // TODO but we have another issue that some other requests might be sent during this time slot. It is better to check
                // refresh token command in the request intercpetor.
                //localStorageService.remove('authorizationData');
                $http = $http || $injector.get('$http');
                $http.post('/api/rs', refreshTokenPost).success(function (response) {
                    _authentication.isAuth = true;
                    _authentication.currentUser = JSON.parse(base64.base64Decode(response.accessToken.split('.')[1])).user;
                    _authentication.useRefreuseshTokens = true;
                    authorizationData.token = response.accessToken; // only access token is replaced.
                    localStorageService.set('authorizationData', authorizationData);
                    console.log("authService:_refreshToken:authrizationData after refresh", authorizationData);
                    deferred.resolve(response);
                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            } else {
                console.log("not use refresh token.");
                deferred.reject();
            }
            return deferred.promise;
        };

        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;
        authServiceFactory.getRefreshToken = _getRefreshToken;

        return authServiceFactory;
    }])
    .factory('httpBuffer', ['$injector', function($injector) {
        /** Holds all the requests, so they can be re-requested in future. */
        var buffer = [];
        var attemptUrl = '';

        /** Service initialized later because of circular dependency problem. */
        var $http;
        var $location;

        function retryHttpRequest(config, deferred) {
            console.log("httpBuffer:retryHttpRequest config", config);
            function successCallback(response) {
                deferred.resolve(response);
            }
            function errorCallback(response) {
                deferred.reject(response);
            }
            $http = $http || $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }

        return {
            /**
             * Appends HTTP request configuration object with deferred response attached to buffer.
             */
            append: function(config, deferred) {
                console.log("httpBuffer.append is called", config, deferred);
                buffer.push({
                    config: config,
                    deferred: deferred
                });
            },

            /**
             * Abandon or reject (if reason provided) all the buffered requests.
             */
            rejectAll: function(reason) {
                console.log("httpBuffer.rejectAll is called", reason);
                if (reason) {
                    for (var i = 0; i < buffer.length; ++i) {
                        buffer[i].deferred.reject(reason);
                    }
                }
                buffer = [];
            },

            /**
             * Retries all the buffered requests clears the buffer.
             */
            retryAll: function(updater) {
                for (var i = 0; i < buffer.length; ++i) {
                    console.log("httpBuffer.retryAll is called");
                    retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                }
                buffer = [];
            },

            saveAttemptUrl: function() {
                $location = $location || $injector.get('$location');
                if($location.path().toLowerCase() != '/signin') {
                    attemptUrl = $location.path();
                    console.log("attemptUrl = {}", attemptUrl);
                } else {
                    attemptUrl = '/page/com-networknt-light-v-user-home';
                    console.log("attemptUrl = {}", attemptUrl);
                }
            },

            redirectToAttemptedUrl: function() {
                $location = $location || $injector.get('$location');
                $location.path(attemptUrl);
            }
        };
    }])
    /**
    * Service that gives us a nice Angular-esque wrapper around the
    * stackTrace.js pintStackTrace() method.
    */
    .factory(
        "traceService",
        function() {
            return({
                print: printStackTrace
            });
        }
    )
    /**
     * Override Angular's built in exception handler, and tell it to
     * use our new exceptionLoggingService which is defined below
     */
    .provider(
        "$exceptionHandler",{
            $get: function(exceptionLoggingService){
                return(exceptionLoggingService);
            }
        }
    )
    /**
     * Exception Logging Service, currently only used by the $exceptionHandler
     * it preserves the default behaviour ( logging to the console) but
     * also posts the error server side after generating a stacktrace.
     */
    .factory("exceptionLoggingService",["$log","$window", "traceService", function($log, $window, traceService) {
        function error(exception, cause) {

            // preserve the default behaviour which will log the error
            // to the console, and allow the application to continue running.
            $log.error.apply($log, arguments);

            // now try to log the error to the server side.
            try{
                var errorMessage = exception.toString();

                // use our traceService to generate a stack trace
                var stackTrace = traceService.print({e: exception});

                var escape = function(x) { return x.replace(/"/g, '\\"'); };
                var XHR = window.XMLHttpRequest || function() {
                        try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e0) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
                        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e4) {}
                };
                var xhr = new XHR();
                xhr.open('POST', '/api/rs', true);
                xhr.setRequestHeader('Content-type', 'application/json');

                var error = '{"category": "log", "name": "logEvent", "readOnly":false, "data": {' +
                    '"message": "' + escape(errorMessage || '') + '",' +
                    '"type": "exception", ' +
                    '"url": "' + escape(window.location.href) + '",' +
                    '"stackTrace": "' + (stackTrace) + '",' +
                    '"cause": "' + escape(cause || '') + '"' +
                    '}}';
                console.log("error", error);
                xhr.send(error);
            } catch (loggingError){
                 $log.warn("Error server-side logging failed");
                 $log.log(loggingError);
            }
        }
        return(error);
    }])
    /**
     * Application Logging Service to give us a way of logging
     * error / debug statements from the client to the server.
     */
    .factory("lightLoggingService", ["$log","$window",function($log, $window) {
        return({
            error: function(message){
                // preserve default behaviour
                $log.error.apply($log, arguments);
                // send server side
                //var escape = function(x) { return x.replace('\\', '\\\\').replace('\"', '\\"'); };
                var escape = function(x) { return x.replace(/"/g, '\\"'); };
                var XHR = window.XMLHttpRequest || function() {
                        try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e0) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
                        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e4) {}
                    };
                var xhr = new XHR();
                xhr.open('POST', '/api/rs', true);
                xhr.setRequestHeader('Content-type', 'application/json');

                var error = '{"category": "log", "name": "logEvent", "readOnly":false, "data": {' +
                    '"message": "' + escape(message || '') + '",' +
                    '"type": "error", ' +
                    '"url": "' + escape(window.location.href) + '"' +
                    '}}';
                console.log("error", error);
                xhr.send(error);
            },
            debug: function(message){
                $log.log.apply($log, arguments);
                var escape = function(x) { return x.replace('\\', '\\\\').replace('\"', '\\"'); };
                var XHR = window.XMLHttpRequest || function() {
                        try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e0) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
                        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e4) {}
                    };
                var xhr = new XHR();
                xhr.open('POST', '/api/rs', true);
                xhr.setRequestHeader('Content-type', 'application/json');

                var error = '{"category": "log", "name": "logEvent", "readOnly":false, "data": {' +
                    '"message": "' + escape(message || '') + '",' +
                    '"type": "debug", ' +
                    '"url": "' + escape(window.location.href) + '"' +
                    '}}';
                console.log("error", error);
                xhr.send(error);
            }
        });
    }])
    .factory('applyFn', ['$rootScope',
        function ($rootScope) {
            return function (fn, scope) {
                fn = angular.isFunction(fn) ? fn : angular.noop;
                scope = scope && scope.$apply ? scope : $rootScope;
                fn();
                if (!scope.$$phase) {
                    scope.$apply();
                }
            };
        }
    ])
    .factory('timing', ['$rootScope', '$q', '$exceptionHandler',
        function ($rootScope, $q, $exceptionHandler) {
            function timing(fn, delay, times) {
                var timingId, count = 0,
                    defer = $q.defer(),
                    promise = defer.promise;

                fn = angular.isFunction(fn) ? fn : angular.noop;
                delay = parseInt(delay, 10);
                times = parseInt(times, 10);
                times = times >= 0 ? times : 0;
                timingId = window.setInterval(function () {
                    count += 1;
                    if (times && count >= times) {
                        window.clearInterval(timingId);
                        defer.resolve(fn(count, times, delay));
                    } else {
                        try {
                            fn(count, times, delay);
                        } catch (e) {
                            defer.reject(e);
                            $exceptionHandler(e);
                        }
                    }
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                }, delay);

                promise.$timingId = timingId;
                return promise;
            }
            timing.cancel = function (promise) {
                if (promise && promise.$timingId) {
                    clearInterval(promise.$timingId);
                    return true;
                } else {
                    return false;
                }
            };
            return timing;
        }
    ])
    .provider('commentsConfig', function() {
        var config = {
            containerTemplate: 'views/comments.html',
            commentTemplate: 'views/comment.html',
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