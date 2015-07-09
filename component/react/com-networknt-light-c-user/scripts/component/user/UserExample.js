var React =  require('react');
var InlineUser = require('./InlineUser.js');



var UserExample = React.createClass({
    render: function() {
        return (
            <div class="ui vertical segment">
                <div class="ui vertical segment">
                    <div class="ui centered page grid">
                        <div class="row">
                            <h1>Network NT User Example</h1>
                        </div>
                    </div>
                </div>
                <div class="ui vertical segment">
                    <div class="ui centered page grid">
                        <div class="row">
                        The following is an example rendering of how a user would appear inline to text referencing this user.
                        </div>
                        <div class="row">
                        This is some text where we reference the user with id = testuser <InlineUser id="testuser"/>.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UserExample;