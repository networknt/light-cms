'use strict';
angular.module('lightApp')

.service('forumRouting', ['$location', 'modelDataService', function($location, modelDataService) {
    return {
        forumHome : function () {
            modelDataService.setModelData(null);
            $location.path("/page/com-networknt-light-v-forum-home");
        },
        forumPosts : function (forum) {
            modelDataService.setModelData({
                forum: forum
            });
            $location.path("/page/com-networknt-light-v-forum-posts");
        },
        addPost : function (forum) {
            modelDataService.setModelData(null);
            $location.path("/form/com.networknt.light.forum.post.add/" + forum.categoryId);
        }
    };
}])
.directive('node', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        template:   '<div class="panel-group" style="margin-bottom:5px;"> \
                        <div class="panel panel-default"> \
                            <div class="panel-heading" data-toggle="collapse" data-target="#collapse-{{node.categoryId}}" href="#collapse-{{node.categoryId}}" style="cursor: pointer;"> \
                                <h4 class="panel-title"> \
                                    <div class="row" style="display:flex; align-items:center;"> \
                                        <div class="col-xs-6 col-sm-6 col-md-6 text-left" style="font-family: \'Open Sans\', \'Helvetica Neue\', Helvetica, Arial, sans-serif; font-weight: 600;"> \
                                            <span class="badge" style="margin-right:20px;">{{node.out_HasPost.length || 0}}</span> <span ng-click="goToForum({{node}})">{{node.categoryId}}</span> \
                                        </div> \
                                        <div class="col-xs-6 col-sm-6 col-md-6 text-right"> \
                                            <button type="button" class="btn btn-success" style="text-align:center;" ng-click="goToForum({{node}})">Read More</button> \
                                        </div> \
                                    </div> \
                                </h4> \
                            </div> \
                            <div id="collapse-{{node.categoryId}}" class="panel-collapse collapse"> \
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
        template: '<node ng-repeat="node in nodeTree"/>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
            nodeTree: '=ngModelNode'
        }
    };
});