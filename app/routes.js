var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

// Here we define all our component examples
var Main = require('./components/main/Main');
var UserExample = require('./components/user/src/UserExample');
var UserProfile = require('./components/user/src/UserProfile');
var Home = require('./components/home/Home');
var Forum = require('./components/forum/Forum');
var News = require('./components/news/News');

var Blogs = require('./components/blog/Blogs');
var Blog = require('./components/blog/Blog');
var BlogPosts = require('./components/blog/BlogPosts');
var BlogPost = require('./components/blog/BlogPost.js');

var SignUp = require('./components/auth/Signup.js');
var Login = require('./components/auth/Login.js');
var Logout = require('./components/auth/Logout.js');

var AppRoutes = (
    <Route name="root" path="/light-cms/" handler={Main}>
        <Route name="home" handler={Home} />
        <Route name="user-example" handler={UserExample}/>
        <Route name="u/:userId" handler={UserProfile}/>
        <Route name="blogs" handler={Blogs}/>
        <Route name="blog" handler={Blog}/>
        <Route name="blogPosts" handler={BlogPosts} />
        <Route name="blogPost" handler={BlogPost}/>
        <Route name="forum" handler={Forum}/>
        <Route name="news" handler={News}/>
        <Route name="signup" handler={SignUp}/>
        <Route name="login" handler={Login}/>
        <Route name="logout" handler={Logout}/>
        <DefaultRoute handler={Home}/>
    </Route>
);

module.exports = AppRoutes;