var React = require('react');
var Router = require('react-router');

var FullWidthSection = require('../../layout/src/full-width-section.js');

var Home = React.createClass({
    render: function() {

        return (
            <FullWidthSection>
                <h1>NetworkNT - Components Example</h1>

                <p>Please feel free to select any example page from the menu in the top left corner to view the example.</p>
            </FullWidthSection>
        );
    }
});

module.exports = Home;