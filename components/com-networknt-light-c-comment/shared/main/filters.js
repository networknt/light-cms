angular.module('lightApp')
.filter('timeago', function() {
    return function(date) {
        return moment(date).fromNow();
    };
})
.filter('calendar', function() {
    return function(date) {
        return moment(date).calendar();
    };
});