var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem} = require('material-ui')

var BlogView = React.createClass({

    componentDidMount: function() {
        console.log("BlogView - props:", this.props);
        console.log("BlogView - state:", this.state);
    },

    render: function() {
        return (
            <FullWidthSection>
                Blog View!
            </FullWidthSection>
        );
    }

});

module.exports = BlogView;