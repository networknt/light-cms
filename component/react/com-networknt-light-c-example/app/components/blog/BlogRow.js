var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var {ListItem} = require('material-ui')
var BlogRow = React.createClass({
    componentDidMount: function() {
        console.log("BlogRow props:", this.props);
    },
    render: function() {
        return (
            <ListItem primaryText={this.props.blog.blogId}></ListItem>
        );
    }
});

module.exports = BlogRow;