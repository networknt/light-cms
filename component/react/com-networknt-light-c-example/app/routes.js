var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

// Here we define all our component examples
var Main = require('./../components/main/src/main');
var UserExample = require('./../components/user/src/UserExample');
var UserProfile = require('./../components/user/src/UserProfile');
var Home = require('./../components/home/src/Home');
var Blog = require('./../components/blog/src/Blog');
var Forum = require('./../components/forum/src/Forum');
var News = require('./../components/news/src/News');

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */

var AppRoutes = (
    <Route name="root" path="/" handler={Main}>
        <Route name="home" handler={Home} />
        <Route name="user-example" handler={UserExample} />
        <Route name="u/:userId" handler={UserProfile} />
        <Route name="blog" handler={Blog} />
        <Route name="forum" handler={Forum} />
        <Route name="news" handler={News} />
        <DefaultRoute handler={Home}/>
    </Route>
);

module.exports = AppRoutes;