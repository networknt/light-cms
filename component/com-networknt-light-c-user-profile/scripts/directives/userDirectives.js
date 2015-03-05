angular.module('lightApp')
.directive('user', function () {
    return {
        scope: {
            userId: '@id'
        },
        restrict:'E',
        templateUrl: 'views/user.html',
        link: function(scope, elm, attr) {
        }
    };
});