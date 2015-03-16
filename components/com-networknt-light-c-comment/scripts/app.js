(function(angular) {
    'use strict';
    angular.module('lightApp', ['ngSanitize', 'ngAnimate'])
        .controller('commentsController', ['$scope', function($scope) {
            $scope.comments = [
                {
                    createUserId: '@caitp',
                    createDate: new Date(),
                    profileUrl: 'https://github.com/caitp',
                    content: 'UI-Comments is designed to simplify the process of creating comment systems similar to Reddit, Imgur or Discuss in AngularJS.',
                    children: [{
                        createUserId: '@bizarro-caitp',
                        createDate: new Date(),
                        profileUrl: 'https://github.com/bizarro-caitp',
                        content: 'We support nested comments, in a very simple fashion. It\'s great!',
                        children: [{
                            createUserId: '@caitp',
                            createDate: new Date(),
                            profileUrl: 'https://github.com/caitp',
                            content: 'These nested comments can descend arbitrarily deep, into many levels. This can be used to reflect a long and detailed conversation about typical folly which occurs in comments',
                            children: [{
                                createUserId: '@bizarro-caitp',
                                createDate: new Date(),
                                profileUrl: 'https://github.com/bizarro-caitp',
                                content: 'Having deep conversations on the internet can be used to drive and derive data about important topics, from marketing demographic information to political affiliation and even sexual orientation if you care to find out about that. Isn\'t that exciting?'
                            }]
                        },{
                            createUserId: '@bizarro-caitp',
                            createDate: new Date(),
                            profileUrl: 'https://github.com/bizarro-caitp',
                            content: 'Is it REALLY all that wonderful? People tend to populate comments with innane nonsense that ought to get them hellbanned!',
                            comments: [{
                                createUserId: '@caitp',
                                createDate: new Date(),
                                profileUrl: 'https://github.com/caitp',
                                content: 'Oh whatever lady, whatever'
                            }]
                        }]
                    }]
                }, {
                    createUserId: '@caitp',
                    createDate: new Date(),
                    profileUrl: 'https://github.com/caitp',
                    content: 'We can have multiple threads of comments at a given moment...',
                }, {
                    createUserId: '@bizarro-caitp',
                    createDate: new Date(),
                    profileUrl: 'https://github.com/bizarro-caitp',
                    content: 'We can do other fancy things too, maybe...',
                    children: [{
                        createUserId: '@caitp',
                        createDate: new Date(),
                        profileUrl: 'https://github.com/caitp',
                        content: '...other fancy things, you say?',
                    }, {
                        createUserId: '@caitp',
                        createDate: new Date(),
                        profileUrl: 'https://github.com/caitp',
                        content: 'suddenly I\'m all curious, what else can we do...',
                        children: [{
                            createUserId: '@bizarro-caitp',
                            createDate: new Date(),
                            profileUrl: 'https://github.com/bizarro-caitp',
                            content: 'Oh, you\'ll see...',
                        }]
                    }]
                }];

            $scope.addParentComment = function(comment) {
                var parentComment = angular.extend(comment, {
                    createUserId: '@'+comment.createUserId,
                    createDate: new Date(),
                    profileUrl: 'https://github.com/' + comment.createUserId
                });
                $scope.comments.push(parentComment);
            };
        }])
})(window.angular);