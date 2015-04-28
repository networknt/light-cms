'use strict';
angular.module('lightApp')

.service('blogBackend', ['$http', function($http) {
    return {
        getBlogTree : function (host) {
           var getBlogTreeQuery = {
                category : "blog",
                name : "getBlogTree",
                readOnly: true,
                data: {
                    host: host
                }
           };
           return $http.post('api/rs', getBlogTreeQuery).then(function (response) {
                return response;
           });
        },
        getBlog : function (host, blogRid) {
            var getBlogQuery = {
                category : 'blog',
                name : 'getBlog',
                readOnly: true,
                data: {
                    host: host,
                    "@rid": blogRid
                }
            };
            return $http.post('api/rs', getBlogQuery).then(function (response) {
                return response;
            });
        }
    };
}])

.service('postBackend', ['$http', function($http) {
    return {
        getBlogPosts : function (host, blogRid, pageNo, itemsPerPage, sortDir, sortBy) {
            var getBlogPostsQuery = {
                category : 'blog',
                name : 'getBlogPost',
                readOnly: true,
                data: {
                    host: host,
                    "@rid": blogRid,
                    pageNo: pageNo,
                    pageSize : itemsPerPage,
                    sortDir : sortDir,
                    sortedBy : sortBy
                }
            };
            return $http.post('api/rs', getBlogPostsQuery).then (function (response) {
                return response;
            });
        },
        getPost : function (host, postRid) {
            var getPostQuery = {
                category : 'post',
                name : 'getPost',
                readOnly: true,
                data: {
                    host: host,
                    "@rid": postRid
                }
            };
            return $http.post('api/rs', getPostQuery).then(function (response){
                return response;
            });
        },
        upvote : function (host, postRid) {
            var upvoteQuery = {
                category: 'post',
                name: 'upPost',
                readOnly: false,
                data: {
                    host: host,
                    '@rid': postRid
                }
            };
            return $http.post('api/rs', upvoteQuery).then(function (response) {
                return response;
            });
        },
        downvote : function (host, postRid) {
            var downvoteQuery = {
                category: 'post',
                name: 'downPost',
                readOnly: false,
                data: {
                    host: host,
                    '@rid': postRid
                }
            };
            return $http.post('api/rs', downvoteQuery).then (function (response) {
                return response;
            });
        }
    };
}]);