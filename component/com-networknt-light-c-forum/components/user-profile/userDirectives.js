angular.module('lightApp')
.directive('user', function () {
    return {
        scope: {
            userId: '@id'
        },
        restrict:'E',
        templateUrl: 'components/user-profile/user.html',
        link: function(scope, elm, attr) {
        }
    };
});