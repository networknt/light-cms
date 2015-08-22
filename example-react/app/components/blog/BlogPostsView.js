var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var {List, ListItem, Paper, Avatar, Styles, SvgIcon} = require('material-ui');
var { Colors, Spacing, Typography } = Styles;
// var {ActionAssignment} = SvgIcon;
// using leftAvatar={<Avatar icon={<ActionAssignment />}/>} in ListItem causing an error... figure out why.
var BlogPostsView = React.createClass({
    getDefaultProps: function() {
        blogPosts: []
    },
    render: function() {
        return (
            <FullWidthSection>
                <Paper rounded={true} transitionEnabled={true}>
                    <List>
                    {
                        this.props.blogPosts.map(function (post) {
                            return (
                                <ListItem primaryText={post.title} secondaryText={post.content}></ListItem>
                            );
                        })
                        }
                    </List>
                </Paper>
            </FullWidthSection>
        );
    }
});

module.exports = BlogPostsView;