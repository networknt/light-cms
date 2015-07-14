var React =  require('react');

var UserProfile = React.createClass({
    getInitialState: function() {
        return {
            userId: this.props.params.userId != null ? this.props.params.userId : "Example"
        };
    },
    render: function() {
        return (
            <span>User Profile - Hello {this.state.userId}!</span>
        );
    }
});

module.exports = UserProfile;