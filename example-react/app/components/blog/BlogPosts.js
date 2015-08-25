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
                <Paper className="blogPostsPaper">
                    <div style={styles.leftColumn}>
                        <h2>
                            <strong style={styles.strongDate}>August 24,</strong> <span style={styles.year}>2015</span>
                        </h2>
                        <h1 style={styles.title}>Title</h1>
                        <p style={styles.content}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            At doloremque ducimus ea eaque, illo impedit officiis perferendis
                            quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                            Aspernatur assumenda deserunt nobis.
                        </p>
                    </div>
                </Paper>
                <hr />
                <Paper className="blogPostsPaper">
                    <div style={styles.leftColumn}>
                        <h2>
                            <strong style={styles.strongDate}>August 24,</strong> <span style={styles.year}>2015</span>
                        </h2>
                        <h1 style={styles.title}>Title</h1>
                        <p style={styles.content}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            At doloremque ducimus ea eaque, illo impedit officiis perferendis
                            quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                            Aspernatur assumenda deserunt nobis.
                        </p>
                    </div>
                </Paper>
                <hr />
                <Paper className="blogPostsPaper">
                    <div style={styles.leftColumn}>
                        <h2>
                            <strong style={styles.strongDate}>August 24,</strong> <span style={styles.year}>2015</span>
                        </h2>
                        <h1 style={styles.title}>Title</h1>
                        <p style={styles.content}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            At doloremque ducimus ea eaque, illo impedit officiis perferendis
                            quibusdam quidem, quod sed sequi similique sit sunt voluptatum.
                            Aspernatur assumenda deserunt nobis.
                        </p>
                    </div>
                </Paper>
            </div>
        );
    },
    _getStyles: function() {
        return {
            leftColumn: {
                //backgroundColor: "orange",
                marginTop: 0,
                padding: 10,
                //border: '1px solid black'

            },
            title: {
                fontSize: '48px',
                fontWeight: '300',
                lineHeight: '72px',
                fontFamily: 'Lato',
                color: Colors.green400
            },
            strongDate: {
                fontSize: '32px',
                fontWeight: '700',
                fontFamily: 'Lato',
                color: Colors.black
            },
            year: {
                fontSize: '24px',
                fontWeight: '300',
                fontFamily: 'Lato',
                color: Colors.black
            },
            content: {
                fontSize: '24px',
                fontWeight: '300',
                lineHeight: '40px',
                fontFamily: 'Lato'
            }

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