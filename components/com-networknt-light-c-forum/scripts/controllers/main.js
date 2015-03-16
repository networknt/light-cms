'use strict';

angular.module('lightApp')
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.page = { maxSize: 5, currentPage: 1, numPerPage: 10, totalItems: 20, numPages: 0 }
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.page.currentPage);
            var begin = (($scope.page.currentPage - 1) * $scope.page.numPerPage)
                , end = begin + $scope.page.numPerPage;
            $scope.filteredFeeds = $scope.feeds.slice(begin, end);
        };

    }]);
