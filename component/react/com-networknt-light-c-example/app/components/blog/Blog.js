var React =  require('react');
var FullWidthSection = require('./../../layout/src/full-width-section.js');

var Blog = React.createClass({
    componentWillMount: function() {
    },
    getInitialState: function() {
        return {
         };
    },
    render: function() {
        return (
            <FullWidthSection>
                Blog
            </FullWidthSection>
        );
    }
});

module.exports = Blog;