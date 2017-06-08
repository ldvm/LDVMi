import React, {Component, PropTypes} from "react";
import Label from "./Label";
import Comment from "./Comment";

// Shows all available info about an object.
export default class ObjectInfo extends Component {
    static propTypes = {
        header: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    };

    render() {
        const {header, url} = this.props;

        return <table>
            <tbody>
            <tr>
                <td><b>{header}</b></td>
                <td>{url}</td>
            </tr>
            <tr>
                <td>Label: </td>
                <td><Label uri={url} label="n/a"/></td>
            </tr>
            <tr>
                <td>Comment: </td>
                <td><Comment uri={url} comment="n/a"/></td>
            </tr>
            </tbody>
        </table>
    }
}