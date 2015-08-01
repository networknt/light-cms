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

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAction.receiveBlogs();
    },

    getInitialState: function() {
        return BlogStore.getBlogState();
    },

    render: function() {
        var styles = this.getStyles();
        return (
            <div>
                <FullWidthSection style={styles.root}>
                    <div>
                        <h2 style={styles.h2} >Blogs</h2>
                    </div>
                </FullWidthSection>

                <FullWidthSection style={styles.blogsSection}>
                    <List>
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

    _onChange: function() {
        this.setState(BlogStore.getBlogState());
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
                textAlign: 'center'
            },
            blogsSection: {
                backgroundColor: Colors.white,
                textAlign: 'center',
                display: 'inline-block',
                width: '100%'
            },
            h2: {
                //.mui-font-style-title
                fontSize: '20px',
                lineHeight: '28px',
                paddingTop: '19px',
                marginBottom: '13px',
                letterSpacing: '0',
                color: Colors.darkWhite,
                fontWeight: Typography.fontWeightLight
            }
        };
    }

});

module.exports = Blogs;