var React =  require('react');
var FullWidthSection = require('./../common/full-width-section.js');

var News = React.createClass({
    componentWillMount: function() {
    },
    getInitialState: function() {
        return {
        };
    },
    render: function() {
        return (
            <FullWidthSection>
            News
            </FullWidthSection>
        );
    }
});

module.exports = News;