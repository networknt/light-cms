var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem, Paper, RaisedButton} = require('material-ui')

var BlogView = React.createClass({

    getDefaultProps: function() {
        blogId: '#33:12'
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this._receivedBlog);
        BlogAction.receiveBlog(this.props.blogId);
    },

    render: function() {
        return (
            <FullWidthSection>
                <RaisedButton label="Back" />
                <Paper circle="false" rouded="true" transitionEnabled="true">
                    Blog View!
                </Paper>
            </FullWidthSection>
        );
    },
    _receivedBlog: function(data) {
        console.log("Received blog:", data);
    }
});

module.exports = BlogView;