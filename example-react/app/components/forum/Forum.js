var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');

var Forum = React.createClass({
    componentWillMount: function() {
    },
    getInitialState: function() {
        return {
        };
    },
    render: function() {
        return (
            <FullWidthSection>
            Forum
            </FullWidthSection>
        );
    }
});

module.exports = Forum;