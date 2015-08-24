var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem, Paper, Styles} = require('material-ui');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var { Colors, Spacing, Typography } = Styles;

var Blogs = React.createClass({

    getInitialState: function() {
        return {
            blogs: []
        }
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAction.getBlogs();
    },

    _onChange: function() {
        console.log("Blogs._onChange");
        this.setState({
            blogs: BlogStore.getBlogs()
        });
    },

    render: function() {
        var styles = this.getStyles();
        return (
            <div>
                <FullWidthSection style={styles.root}>
                        <h2 style={styles.h2} >Blog Component</h2>
                </FullWidthSection>

                <FullWidthSection style={styles.blogsSection}>
                    <List style={styles.blogsList} >
                        {
                            this.state.blogs.map(function (blog) {
                                return (
                                    <BlogRow blog={blog}></BlogRow>
                                );
                            })
                        }
                    </List>
                </FullWidthSection>
            </div>
        );
    },



    componentWillUnmount: function() {
        BlogStore.removeChangeListener(this._onChange);
    },

    getStyles: function() {
        return {
            root: {
                backgroundColor: Colors.green400,
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            h2: {
                fontSize: '20px',
                color: Colors.darkWhite,
                fontWeight: Typography.fontWeightLight
            },
            blogsSection: {
                backgroundColor: Colors.white,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            blogsList: {
                width: '600px'
            }
        };
    }

});

module.exports = Blogs;