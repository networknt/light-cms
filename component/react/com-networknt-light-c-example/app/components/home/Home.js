var React = require('react');
var Router = require('react-router');

var FullWidthSection = require('../common/full-width-section.js');

var Home = React.createClass({
    render: function() {
        return (
            <FullWidthSection>
                <h1>NetworkNT - Components Example</h1>

                <p>Please select any page from the menu in the top left corner to view the example.</p>
            </FullWidthSection>
        );
    }
});

module.exports = Home;