import React from 'react'
import {Input} from 'react-bootstrap'

/**
 * Horizontal Input. Automatically adds Bootstrap wrappers and labels around the
 * input to make the form horizontal.
 *
 * @property {number} labelWidth size of the label column (1-12)
 */
export default class InputH extends React.Component {

    render() {
        const props = this.props;
        const labelWidth = props.labelWidth || 2;
        const wrapperWidth = 12 - labelWidth;

        let labelClassName = "col-md-" + labelWidth;
        let wrapperClassName = "col-md-" + wrapperWidth;

        if (props.type === "submit") {
            labelClassName = "";
            wrapperClassName ="col-md-offset-" + labelWidth + " col-md-" + wrapperWidth;
        }

        return <Input {...this.props} labelClassName={labelClassName} wrapperClassName={wrapperClassName} />
    }
};

InputH.propTypes = {
    labelWidth: React.PropTypes.number
};