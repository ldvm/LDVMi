import React from 'react'
import {Input} from 'react-bootstrap'

/**
 * Little input extension that allows input to be more easily connected to a
 * form component with FormValidationMixin.
 *
 * @property {object} connect object that encapsulates valueLink, bsStyle
 *  (css class determining input style) and help (help text).
 */
export default React.createClass({
    propTypes: {
        connect: React.PropTypes.object
    },

    render: function () {
        var connect = this.props.connect;
        var props = this.props;

        if (connect) {
            return <Input valueLink={connect.valueLink} bsStyle={connect.bsStyle()} help={connect.help()} {...props} />
        } else {
            return <Input {...props} />
        }
    }
});