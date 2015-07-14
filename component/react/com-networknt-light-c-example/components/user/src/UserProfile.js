var React =  require('react');

var UserProfile = React.createClass({
    render: function() {
        var { userID } = this.props.params;
        return (
            <span>User Profile - Hello {userID}!</span>
        );
    }
});

module.exports = UserProfile;