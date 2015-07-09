'use strict';

var React = require('react');
window.jQuery = require('./node_modules/jquery/dist/jquery.min');
require('./node_modules/semantic-ui/dist/semantic.min');
require('./node_modules/semantic-ui/dist/semantic.min.css');

var InlineUser = require('./scripts/component/user/InlineUser.js');

var UserExample = React.createClass({
    render: function() {
        return (
            <div>
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
                        This is some text where we reference the user with id = testuser.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});//require('./scripts/component/user/UserExample');

React.render(<UserExample />, document.getElementById('content'));
