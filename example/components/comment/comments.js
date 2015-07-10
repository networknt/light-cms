'use strict';
angular.module('lightApp')
.controller('commentCtrl', function($scope, $element, $timeout, authService, $http) {
    var children;
    $scope.collapsed = true;
    $scope.$on('$filledNestedComments', function(nodes) {
        console.log("received $filledNestedComments");
        $scope.collapsed = true;
        console.log("nodes", nodes);
        $timeout(function() {
            children = nodes;
            children.addClass('collapse').removeClass('in');
            children.collapse({
                toggle: false
            });
            // Stupid hack to wait for DOM insertion prior to setting up plugin
        }, 1);
    });

    $scope.$on('$emptiedNestedComments', function(nodes) {
        console.log("received $emptiedNestedComments");
        children = undefined;
    });

    $scope.collapse = function() {
        console.log("$scope.collapsed", $scope.collapsed);
        $scope.collapsed = children.hasClass('in');
        children.collapse('toggle');
    };

    $scope.addChildComment = function(comment) {
        var currentUser = authService.authentication.currentUser;
        console.log("currentUser: ", currentUser);
        console.log("addChildComment: ", comment);
        var childComment = angular.extend(comment, {
            createUserId: currentUser.userId,
            createDate: new Date(),
            content: comment.text
        });
        if(!$scope.comment.out_HasChildren) {
            $scope.comment.out_HasChildren = [];
        }
        $scope.submitComment ($scope.comment, childComment);
        $scope.comment.out_HasChildren.push(childComment);
    };

    $scope.postAddComment = {
        category: 'comment',
        name: 'addComment',
        readOnly: false,
        data: {}
    };

    $scope.submitComment = function (parent, child) {
        console.log("parent:", parent);
        console.log("child:", child);
        if (child != null && child.content.length > 0) {
            // TODO: Adding a comment to a comment more then 1 level deep doesn't work since it getCommentTree doesn't return with the @rid value.
            $scope.postAddComment.data["host"] = parent.host;
            $scope.postAddComment.data["@rid"] = parent["@rid"];
            $scope.postAddComment.data.comment = child.content;
            console.log("submitComment: Posting with:", $scope.postAddComment);
            $http.post('api/rs', $scope.postAddComment)
                .success(function (result, status, headers, config) {
                    console.log("success! result:", result);
                })
                .error(function (result, status, headers, config) {
                    console.log("submitComment error, result:", result);
                });
        }
    };
});
