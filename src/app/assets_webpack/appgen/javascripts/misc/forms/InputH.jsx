import React from 'react'
import Input from './Input.jsx'

/**
 * Horizontal Input. Automatically adds Bootstrap wrappers and labels around the
 * input to make the form horizontal.
 *
 * @property {number} labelWidth size of the label column (1-12)
 */
export default React.createClass({
    propTypes: {
        labelWidth: React.PropTypes.number
    },

    render: function () {
        var labelWidth = this.props.labelWidth || 2;
        var wrapperWidth = 12 - labelWidth;
        var props = this.props;

        var labelClassName = "col-md-" + labelWidth;
        var wrapperClassName = "col-md-" + wrapperWidth;

        if (props.type === "submit") {
            labelClassName = "";
            wrapperClassName ="col-md-offset-" + labelWidth + " col-md-" + wrapperWidth;
        }

        return <Input {...this.props} labelClassName={labelClassName} wrapperClassName={wrapperClassName} />
    }
});