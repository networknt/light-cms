var React = require('react');
var { ClearFix, Mixins, Styles } = require('material-ui');
var { StylePropable, StyleResizable } = Mixins;
var DesktopGutter = Styles.Spacing.desktopGutter;


var FullWidthSection = React.createClass({

    mixins: [StylePropable, StyleResizable],

    propTypes: {
        'useContent': React.PropTypes.bool,
        'contentType': React.PropTypes.string,
        'contentStyle': React.PropTypes.object
    },

    getDefaultProps() {
        return {
            useContent: false,
            contentType: 'div'
        };
    },

    getStyles: function() {
        return  {
            root: {
                padding: DesktopGutter + 'px',
                boxSizing: 'border-box'
            },
            content: {
                maxWidth: '1200px',
                margin: '0 auto'
            },
            rootWhenSmall: {
                paddingTop: (DesktopGutter * 2) + 'px',
                paddingBottom: (DesktopGutter * 2) + 'px'
            },
            rootWhenLarge: {
                paddingTop: (DesktopGutter * 3) + 'px',
                paddingBottom: (DesktopGutter * 3) + 'px'
            }
        };
    },

    render: function() {
        var styles = this.getStyles();
        var {style, useContent, contentType, contentStyle} = this.props;
        var content;

        if (useContent) {
            content =
                React.createElement(
                    contentType,
                    {style: this.mergeAndPrefix(styles.content, contentStyle)},
                    this.props.children
                );
        } else {
            content = this.props.children;
        }

        return (
            <ClearFix style={this.mergeAndPrefix(
                    styles.root,
                    style,
                    this.isDeviceSize(StyleResizable.statics.Sizes.SMALL) && styles.rootWhenSmall,
                    this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && styles.rootWhenLarge)}>
                {content}
            </ClearFix>
        );
    }
});

module.exports = FullWidthSection;