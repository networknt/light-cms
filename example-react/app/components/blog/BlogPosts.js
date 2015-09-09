var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var {List, ListItem, Paper, Avatar, Styles, SvgIcon} = require('material-ui');
var { Colors, Spacing, Typography } = Styles;


var BlogPostsView = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    componentDidMount: function() {
    },
    _routeToPost: function() {
        this.context.router.transitionTo("/light-cms/blogPost");
    },
    render: function() {
        var styles = this._getStyles();
        return (
            <div className="blogPostsRoot">
                <div className="blogPostsleftColumn">
                    <Paper className="blogPostsPaper">
                        <div className="blogPost">
                            <h2>
                                <strong className="strongDate">August 24,</strong> <span className="year">2015</span>
                            </h2>
                            <h1 className="title"><a onClick={this._routeToPost}>Title</a></h1>
                            <p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                At doloremque ducimus ea eaque, illo impedit officiis perferendis
                                quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                                Aspernatur assumenda deserunt nobis.
                            </p>
                        </div>
                    </Paper>
                    <hr />
                    <Paper className="blogPostsPaper">
                        <div className="blogPost">
                            <h2>
                                <strong className="strongDate">August 24,</strong> <span className="year">2015</span>
                            </h2>
                            <h1 className="title"><a onClick={this._routeToPost}>Title</a></h1>
                            <p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                At doloremque ducimus ea eaque, illo impedit officiis perferendis
                                quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                                Aspernatur assumenda deserunt nobis.
                            </p>
                        </div>
                    </Paper>
                    <hr />
                    <Paper className="blogPostsPaper">
                        <div className="blogPost">
                            <h2>
                                <strong className="strongDate">August 24,</strong> <span className="year">2015</span>
                            </h2>
                            <h1 className="title"><a onClick={this._routeToPost}>Title</a></h1>
                            <p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                At doloremque ducimus ea eaque, illo impedit officiis perferendis
                                quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                                Aspernatur assumenda deserunt nobis.
                            </p>
                        </div>
                    </Paper>
                </div>

                <div className="blogPostsRightColumn">
                    <div className="blogInfo">
                        <h1>Blog Information</h1>
                        <p>In this section, you will see some information and references pertaining to the opened blog.</p>
                        <p>Also, having the screen width be less then 64em will hide it, leaving reading room for mobile users only concerned with reading post content on the go.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci alias cum, cumque cupiditate ea eum itaque, minus molestias necessitatibus nihil pariatur perspiciatis quam quas quod rem repellat, sint voluptate.</p>
                    </div>
                </div>

            </div>
        );
    },
    _getStyles: function() {
        return {


        }
    }
});

module.exports = BlogPostsView;

//<Paper rounded={true} transitionEnabled={true}>
//    <List>
//        {
//            this.props.blogPosts.map(function (post) {
//                return (
//                    <ListItem primaryText={post.title} secondaryText={post.content}></ListItem>
//                );
//            })
//        }
//    </List>
//</Paper>