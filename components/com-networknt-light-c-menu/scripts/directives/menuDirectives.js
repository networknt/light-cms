angular.module('lightApp')
.directive('menu', function () {
    return {
        scope: {
            host: '@host'
        },
        restrict:'E',
        templateUrl: 'views/menu.html',
        controller: 'menuCtrl',
        link: function(scope, elm, attr) {
        }
    };
});