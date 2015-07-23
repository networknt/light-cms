var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem} = require('material-ui');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');

var Blogs = React.createClass({

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAction.receiveBlogs();
        var escape = function(x) { return x.replace('\\', '\\\\').replace('\"', '\\"'); };
        var XHR = window.XMLHttpRequest || function() {
                try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e0) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
                try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e4) {}
            };
        var xhr = new XHR();
        xhr.open('POST', '/api/rs', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        var error = '{"category": "log", "name": "logEvent", "readOnly":false, "data": {' +
            '"message": "",' +
            '"source": "",' +
            '"url": "",' +
            '"line": "",' +
            '"column": ""' +
            '}}';
        console.log("error", error);
        xhr.send(error);
    },

    getInitialState: function() {
        return BlogStore.getBlogState();
    },

    render: function() {
        return (
            <List subheader="Blogs">
                {
                    this.state.blogs.map(function (blog) {
                        return (
                            <BlogRow key={blog.blogId} blog={blog} nestedLevel={0}></BlogRow>
                        );
                    })
                    }
            </List>
        );
    },

    _onChange: function() {
        this.setState(BlogStore.getBlogState());
    },

    componentWillUnmount: function() {
        BlogStore.removeChangeListener(this._onChange);
    }

});

module.exports = Blogs;