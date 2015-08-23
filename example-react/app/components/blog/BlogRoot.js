var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');

var BlogRow = require('./BlogRow');
var {List, ListItem} = require('material-ui');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var BlogRoot = React.createClass({
    render: function() {
        return (
            <FullWidthSection>
                <RouteHandler />
            </FullWidthSection>
        );
    }
});

module.exports = BlogRoot;