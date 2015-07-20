var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

// Here we define all our component examples
var Main = require('./components/main/src/Main');
var UserExample = require('./components/user/src/UserExample');
var UserProfile = require('./components/user/src/UserProfile');
var Home = require('./components/home/Home');
var Forum = require('./components/forum/Forum');
var News = require('./components/news/News');

var BlogRoot = require('./components/blog/BlogRoot');
var Blogs = require('./components/blog/Blogs');
var BlogView = require('./components/blog/BlogView');
var BlogPostView = require('./components/blog/BlogPostView.js');

var AppRoutes = (
    <Route name="root" path="/" handler={Main}>
        <Route name="home" handler={Home} />
        <Route name="user-example" handler={UserExample} />
        <Route name="u/:userId" handler={UserProfile} />
        <Route name="blogroot" path ="/blog" handler={BlogRoot}>
            <Route name="blogs" handler={Blogs} />
            <Route name="blogView" handler={BlogView} />
            <Route name="blogPostView" handler={BlogPostView} />
            <DefaultRoute handler={Blogs} />
        </Route>
        <Route name="forum" handler={Forum} />
        <Route name="news" handler={News} />
        <DefaultRoute handler={Home}/>
    </Route>
);

module.exports = AppRoutes;