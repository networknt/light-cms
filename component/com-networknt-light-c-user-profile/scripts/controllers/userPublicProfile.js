'use strict';

/**
 * This is a generic page controller. It handles pages without special handling.
 * Pages are always loaded from file system first from /src folder, if it cannot be found then they are
 * loaded from the database by REST API calls. This is the dev environment and production is always loaded
 * from REST API.
 */
angular.module('lightApp')
.controller('UserPublicProfileCtrl', ['$scope', '$routeParams', '$http', 'toaster', 'modelDataService', 'authService', function($scope, $routeParams, $http, toaster, modelDataService, authService) {
    console.log("Getting page with id:", $routeParams.id);
    console.log("Authservice:", authService);

    $scope.getPublicUserInfo = {
        category : 'user',
        name : 'getUser',
        readOnly: true,
        data: {}
    };

    $scope.userInfo = null;

    $scope.fetchUserInfo = function () {
        var userId = $routeParams.id;
        if (userId != null && userId.length > 0) {
            $scope.getPublicUserInfo.data["userId"] = userId;
            $http.post('api/rs', $scope.getPublicUserInfo)
                .success(function(result, status, headers, config) {
                    console.log("getPublicUserInfo Success:", result);
                    $scope.userInfo = result;
                })
                .error(function(result, status, headers, config){
                    console.log("getPublicUserInfo Error:", result, "status", status);
                });
        }
    };

    $scope.fetchUserInfo();
}]);
