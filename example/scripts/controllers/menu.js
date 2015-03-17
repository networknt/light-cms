'use strict';

angular.module('lightApp').controller('menuCtrl', ['$scope', '$http', 'authService', function($scope, $http, authService) {
    $scope.menuSettings = {isCollapsed : true};
    $scope.tree = [];
    $scope.isUserLoggedIn = authService.authentication.isAuth;

    var getMenuPost = {
        category : 'menu',
        name : 'getMenu',
        readOnly: true,
        data : {
            host : $scope.host
        }
    };



    $http.post('api/rs', getMenuPost)
        .success(function(result, status, headers, config) {
            console.log("getMenuPost result", result);
            $scope.tree = result.out_Own;
            console.log("get menus", $scope.tree);

        });

    $scope.toggleCollapsed = function () {
        $scope.menuSettings.isCollapsed =  !$scope.menuSettings.isCollapsed;
    };

    $scope.hasAccess = function(item) {
        $scope.isUserLoggedIn = authService.authentication.isAuth;
        //console.log('item = ', item);
        //console.log('currentUser', authService.authentication.currentUser);
        //console.log('item.roles', item.roles);
        for (var i = 0; i < authService.authentication.currentUser.roles.length; i++) {
            if (item.roles != null) {
                for (var j = 0; j < item.roles.length; j++) {
                    if (authService.authentication.currentUser.roles[i] == item.roles[j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    $scope.logOut = function () {
        authService.logOut();
    };
}]);