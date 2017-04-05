angular.module('telemetry')
    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                if (typeof $window.localStorage[key] != 'undefined') {
                    return JSON.parse($window.localStorage[key]);
                } else {
                    return {};
                }
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            }
        }
    }]);