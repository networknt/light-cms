'use strict';
angular.module('lightApp')

.service('bfnBackend', ['$http', function($http) {
	var capFirst = function (string) {
		if (string.length > 0) {
			return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
		}
		return "";
	};
    return {
        getTree : function (category, host) {
           var getTreeQuery = {
                category : category,
                name : "get" + capFirst(category) + "Tree",
                readOnly: true,
                data: {
                    host: host
                }
           };
           return $http.post('api/rs', getTreeQuery).then(function (response) {
                return response;
           });
        },
        getByRid : function (category, host, rid) {
            var getByRidQuery = {
                category : category,
                name : 'get' + capFirst(category),
                readOnly: true,
                data: {
                    host: host,
                    "@rid": rid
                }
            };
            return $http.post('api/rs', getByRidQuery).then(function (response) {
                return response;
            });
        },
        getPosts : function (category, host, rid, pageNo, itemsPerPage, sortDir, sortBy) {
            var getPostsQuery = {
                category : category,
                name : 'get' + capFirst(category) + 'Post',
                readOnly: true,
                data: {
                    host: host,
                    "@rid": rid,
                    pageNo: pageNo,
                    pageSize : itemsPerPage,
                    sortDir : sortDir,
                    sortedBy : sortBy
                }
            };
            return $http.post('api/rs', getPostsQuery).then (function (response) {
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
        upvotePost : function (host, postRid) {
            var upvotePostQuery = {
                category: 'post',
                name: 'upPost',
                readOnly: false,
                data: {
                    host: host,
                    '@rid': postRid
                }
            };
            return $http.post('api/rs', upvotePostQuery).then(function (response) {
                return response;
            });
        },
        downvotePost : function (host, postRid) {
            var downvotePostQuery = {
                category: 'post',
                name: 'downPost',
                readOnly: false,
                data: {
                    host: host,
                    '@rid': postRid
                }
            };
            return $http.post('api/rs', downvotePostQuery).then (function (response) {
                return response;
            });
        },
        addPost : function (category, host, parentId, title, content, tags, source, summary) {
            var addPostQuery = {
                category : category,
                name : 'addPost',
                readOnly: false,
                data: {
                    host: host,
                    parentId: parentId,
                    title: title,
                    content: content,
                    tags: tags,
                    source: source,
                    summary: summary
                }
            };
            return $http.post('api/rs', addPostQuery).then (function (response) {
                return response;
            });
        },
        updatePost : function (category, host, postRid, title, content, tags, source, summary) {
            var updatePostQuery = {
                category : category,
                name : 'updPost',
                readOnly: false,
                data: {
                    host: host,
                    "@rid": postRid,
                    title: title,
                    content: content,
                    tags: tags,
                    source: source,
                    summary: summary
                }
            };
            return $http.post('api/rs', updatePostQuery).then (function (response) {
                return response;
            });
        }
    };
}]);