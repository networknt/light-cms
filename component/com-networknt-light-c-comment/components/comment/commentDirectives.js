angular.module('lightApp')
.directive('comments', function($compile, $interpolate, commentsConfig) {
    return {
        restrict: 'EA',
        require: '?^comment',
        transclude: true,
        replace: true,
        templateUrl: function() { return commentsConfig.containerTemplate; },
        scope: {
            'comments': '=commentData'
        },
        controller: function() {},
        link: {
            pre: function(scope, elem, attr, comment) {
                var self = elem.controller('comments'),
                    parentCollection = comment ? comment.comments : null;
                // Setup $commentsController
                if (parentCollection) {
                    self.commentsDepth = parentCollection.commentsDepth + 1;
                    self.commentsRoot = parentCollection.commentsRoot;
                    self.commentsParent = parentCollection;
                } else {
                    self.commentsDepth = 1;
                    self.commentsRoot = null;
                    var depthLimit = angular.isDefined(attr.commentDepthLimit) ?
                        attr.commentDepthLimit :
                        commentsConfig.depthLimit;
                    if (typeof depthLimit === 'string') {
                        depthLimit = $interpolate(depthLimit, false)(scope.$parent);
                        if (typeof depthLimit === 'string') {
                            depthLimit = parseInt(depthLimit, 10);
                        }
                    }

                    if (typeof depthLimit !== 'number' || depthLimit !== depthLimit) {
                        // Avoid NaN and non-numbers
                        depthLimit = 0;
                    }

                    self.commentsDepthLimit = depthLimit;
                }

                scope.commentsDepth = self.commentsDepth;
                attr.$observe('orderBy', function(newval, oldval) {
                    scope.commentOrder = newval || commentsConfig.orderBy;
                });
            }
        }
    };
})
.directive('comment', function($compile, commentsConfig, $controller, $exceptionHandler) {
    return {
        require: ['^comments', 'comment'],
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: function() { return commentsConfig.commentTemplate; },
        scope: {
            comment: '=commentData'
        },
        controller: function($scope) {},
        link: function(scope, elem, attr, ctrls) {
            var comments = ctrls[0], comment = ctrls[1];
            var controller = commentsConfig.commentController, controllerInstance;

            scope.commentDepth = comments.commentsDepth;
            scope.commentDepthLimit = (comments.commentsRoot || comments).commentsDepthLimit;
            comment.comments = comments;

            if (controller) {
                controllerInstance = $controller(controller, {
                    '$scope': scope,
                    '$element': elem
                });
                if (controllerInstance) {
                    elem.data('$CommentController', controllerInstance);
                }
            }
            if (elem.parent().attr('child-comments') === 'true') {
                elem.addClass('child-comment');
            }
            var children = false, compiled,
                sub = $compile('<div comments child-comments="true" ' +
                    'comment-data="comment.out_HasComment"></div>'),
                transclude;
            // Notify controller without bubbling
            function notify(scope, name, data) {
                if (!controllerInstance) { return; }
                var namedListeners = scope.$$listeners[name] || [], i, length, args = [data];
                for (i=0, length=namedListeners.length; i<length; i++) {
                    // if listeners were deregistered, defragment the array
                    if (!namedListeners[i]) {
                        namedListeners.splice(i, 1);
                        i--;
                        length--;
                        continue;
                    }
                    try {
                        //allow all listeners attached to the current scope to run
                        namedListeners[i].apply(null, args);
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                }
            }
            function update(data) {
                if (!angular.isArray(data)) {
                    data = [];
                }
                if (data.length > 0 && !children) {
                    if (comments.commentsDepth >= (comments.commentsRoot || comments).commentsDepthLimit) {
                        notify(scope, '$depthLimitComments', scope.comment);
                        return;
                    }
                    compiled = sub(scope, function(dom) {
                        if (comment.commentsTransclude) {
                            transclude = comment.commentsTransclude.clone(true);
                            comment.commentsTransclude.replaceWith(dom);
                        } else {
                            elem.append(dom);
                        }
                    });
                    children = true;
                    notify(scope, '$filledNestedComments', compiled);
                } else if(!data.length && children) {
                    children = false;
                    if (comment.commentsTransclude && transclude) {
                        compiled.replaceWith(transclude);
                    } else {
                        compiled.remove();
                    }
                    notify(scope, '$emptiedNestedComments', comment.commentsTransclude || elem);
                    transclude = compiled = undefined;
                }
            }

            scope.$watch('comment', function(newval) {
                update(scope.comment.out_HasComment);
            }, true);
        }
    };
})
.directive('commentsTransclude', function() {
    return {
        restrict: 'EA',
        require: '^comment',
        link: function(scope, element, attr, comment) {
            attr.$addClass('comments-transclude');
            comment.commentsTransclude = element;
        }
    };
})
.directive('typeahead', function() {
    return {
        restrict: 'E',
        link: function(scope, elm, att) {
            scope.handleSelection = function(val) {
                scope.child.name = val;
                scope.selected = true;
            };
        },
        template: '<ul class="nav nav-pills nav-stacked" ng-hide="selected">' +
            '<li ng-repeat="item in items | filter:item track by $index" ng-click="handleSelection(item.login)" class="pointer">' +
            '<img class="avatar_img" ng-src="{{ item.avatar_url }}"/> <a>{{ item.login }}</a></li>' +
            '</ul>'
    };
})
.directive('commenter', function () {
    return {
        restrict:'E',
        templateUrl: 'components/comment/commenter.html',
        link: function(scope, elm, attr) {
            var action;
            scope.toggled = scope.$eval(attr.toggle) || false;
            scope.btnText = 'add comment';

            scope.toggle = function() {
                scope.toggled = !scope.toggled;
                scope.btnText = (scope.toggled) ? 'add comment' : 'close';
                scope.child = {};
            };

            attr.$observe('action', function(value) {
                action = scope.$eval(value);
            });

            scope.action = function(val) {
                console.log("In action, scope: ", scope);
                console.log("In action, val: ", val);
                scope.addChildComment(val);
                scope.toggle();
            };

            //scope.$watch('child.name', function(newUserName) {
            //    scope.items = [];
            //});
        }
    };
});