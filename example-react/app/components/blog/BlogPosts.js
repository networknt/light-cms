var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var {List, ListItem, Paper, Avatar, Styles, SvgIcon} = require('material-ui');
var { Colors, Spacing, Typography } = Styles;
// var {ActionAssignment} = SvgIcon;
// using leftAvatar={<Avatar icon={<ActionAssignment />}/>} in ListItem causing an error... figure out why.
var BlogPostsView = React.createClass({
    componentDidMount: function() {
        //console.log("BlogPostsView.componentDidMount state", this.state);
        //console.log("BlogPostsView.componentDidMount props", this.props);
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
                            <h1 className="title">Title</h1>
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
                            <h1 className="title">Title</h1>
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
                            <h1 className="title">Title</h1>
                            <p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                At doloremque ducimus ea eaque, illo impedit officiis perferendis
                                quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                                Aspernatur assumenda deserunt nobis.
                            </p>
                        </div>
                    </Paper>
                </div>

                <div className="blogPostRightColumn">
                    <h1>content</h1>
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