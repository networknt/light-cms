var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');

var BlogPostView = React.createClass({

    render: function() {
        return (
            <FullWidthSection>
                Blog Post View
            </FullWidthSection>
        );
    }

});

module.exports = BlogPostView;