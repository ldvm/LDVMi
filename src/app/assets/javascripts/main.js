import f from './library';
import React from 'react';

f('Hello Tobi!');

console.log(React);
var HelloMessage = React.createClass({
    render: function () {
        return <div>Hello {this.props.name}</div>;
    }
});

React.render(<HelloMessage name="Tobias" />, document.getElementById('mountpoint'));

var log = message => console.log(message);

log('trying to mount something');
