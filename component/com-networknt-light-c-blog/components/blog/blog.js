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
        },
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
        addPost : function (host, blogId, title, content, tags, source, summary) {
            var addPostQuery = {
                category : 'blog',
                name : 'addPost',
                readOnly: false,
                data: {
                    host: host,
                    parentId: blogId,
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
        updatePost : function (host, postRid, title, content, tags, source, summary) {
            var updatePostQuery = {
                category : 'blog',
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
}])
.service('blogRouting', ['$location', 'modelDataService', function($location, modelDataService) {
    return {
        blogHome : function () {
            modelDataService.setModelData(null);
            $location.path("page/com-networknt-light-v-blog-home");
        },
        blogView : function (blog) {
            modelDataService.setModelData({
                blog: blog
            });
            $location.path("/page/com-networknt-light-v-blog-view");
        },
        blogPost : function (blog, postRid) {
            modelDataService.setModelData({
                blog: blog,
                postRid: postRid
            });
            $location.path("/page/com-networknt-light-v-blog-post-view");
        },
        addPost : function (blog) {
            modelDataService.setModelData({
                blog: blog
            });
            $location.path("/page/com-networknt-light-v-blog-post-editor");
        },
        editPost : function (blog, post) {
            modelDataService.setModelData({
                blog: blog,
                post: post
            });
            $location.path("/page/com-networknt-light-v-blog-post-editor");
        }
    };
}]);