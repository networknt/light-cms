var React =  require('react');
var FullWidthSection = require('./../../layout/src/full-width-section.js');
var InlineUser = require('./InlineUser');
var marked = require('react-marked');

var UserExample = React.createClass({
    componentWillMount: function() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });
    },
    getInitialState: function() {
        return {
            markedText: "#NetworkNT - Inline User Example# \n" +
            "This is an example where we pass the userId of an" +
            "example user as it would appear when referenced inline with some text.\n" +
            "This is the user /u/nick who has id 'nick'."
        };
    },
    render: function() {
        return (
            <FullWidthSection>
                {marked(this.state.markedText)}
                <h1>NetworkNT - Inline User Example</h1>
                <p>This is an example where we pass the userId of an example
                user as it would appear when referenced in line in some text.
                </p>
                <p>This is the user <InlineUser id="nick" /> who has id "nick".</p>
            </FullWidthSection>
        );
    }
});

module.exports = UserExample;