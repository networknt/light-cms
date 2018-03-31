var React =  require('react');
var FullWidthSection = require('./../../common/full-width-section.js');
var InlineUser = require('./InlineUser');
var marked = require('marked');

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
            "This is an example where we pass the userId of an " +
            "example user as it would appear when referenced inline with some text.\n" +
            "This is the user <InlineUser id=\"nick\" /> who has id 'nick'. It's a work in progress... it should look like:"
        };
    },
    render: function() {
        return (
            <FullWidthSection>
                <div dangerouslySetInnerHTML={{
                    __html: this.processText(this.state.markedText)
                }}></div>
                <InlineUser id="nick" />
            </FullWidthSection>
        );
    },
    processText: function (text) {
        return marked(text, {sanitize: true});
    }
});

module.exports = UserExample;