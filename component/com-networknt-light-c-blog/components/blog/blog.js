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
}])
.directive('node', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        template:   '<div class="panel-group" style="margin-bottom:5px;"> \
                        <div class="panel panel-default"> \
                            <div class="panel-heading" data-toggle="collapse" data-target="#collapse-{{node.blogId}}" href="#collapse-{{node.blogId}}" style="cursor: pointer;"> \
                                <h4 class="panel-title"> \
                                    <div class="row" style="display:flex; align-items:center;"> \
                                        <div class="col-xs-6 col-sm-6 col-md-6 text-left" style="font-family: \'Open Sans\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600;"> \
                                            <span class="badge" style="margin-right:20px;">{{node.out_HasPost.length || 0}}</span> {{node.blogId}} \
                                        </div> \
                                        <div class="col-xs-6 col-sm-6 col-md-6 text-right"> \
                                            <button type="button" class="btn btn-success" style="text-align:center;" ng-click="goToBlog({{node}})">Read More</button> \
                                        </div> \
                                    </div> \
                                </h4> \
                            </div> \
                            <div id="collapse-{{node.blogId}}" class="panel-collapse collapse"> \
                                <div class="panel-body"> \
                                    <div class="text-center" style="word-wrap: break-word;"> \
                                        {{node.description}} \
                                    </div> \
                                    <div ng-if="node.out_Own.length > 0"> \
                                        <hr style="width:100%;" /> \
                                        <node-tree ng-model-blog="node.out_Own"></node-tree> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div>',
         compile: function (el) {
                     var contents = el.contents().remove();
                     return function(scope,el){
                         $compile(contents)(scope,function(clone){
                             el.append(clone);
                         });
                     };
                 },
        link: function(scope, elm, attrs) {

        }
    };
})
.directive('nodeTree', function() {
    return {
        template: '<node ng-repeat="node in blogTree"/>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
            blogTree: '=ngModelBlog'
        }
    };
});