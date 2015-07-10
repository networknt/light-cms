var React =  require('react');
var FullWidthSection = require('./../../layout/src/full-width-section.js');
var InlineUser = require('./InlineUser');

var InlineUserExample = React.createClass({
    render: function() {
        return (
            <FullWidthSection>
                <p>This is an example where we pass the userId of an example
                user as it would appear when referenced in line in some text.
                </p>
                <p>This is the user <InlineUser id="nick" /> who has id "nick".</p>
            </FullWidthSection>
        );
    }
});

module.exports = InlineUserExample;