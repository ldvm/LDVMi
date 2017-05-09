import React, { Component, PropTypes } from 'react'
import Checkbox from "../../../../components/Checkbox"
import Button from "../../../../components/Button"
import SubHeadLine from "../../../../components/Subheadline"
import CenteredMessage from "../../../../components/CenteredMessage";

class ConfigToolbar extends Component {
    static propTypes = {
        things: PropTypes.array.isRequired,
        header: PropTypes.string.isRequired,

        getKey: PropTypes.func.isRequired,
        getValue: PropTypes.func.isRequired,
        selectedKeys: PropTypes.array.isRequired,

        onChecked: PropTypes.func.isRequired,
        onUnchecked: PropTypes.func.isRequired
    };

    // SEARCH & DEDUPLICATION
    setNeedle(){
        var elements = document.getElementsByName("search");
        if (elements.length > 0)
            this.needle = elements[0].value.toLowerCase();

        if (this.needle && this.needle != ''){
            this.forceUpdate();
        }
    };

    resetNeedle(){
        this.needle='';

        var elements = document.getElementsByName("search");
        if (elements.length > 0) {
            elements[0].value = '';
        }
        this.forceUpdate();
    }

    getMapToRender(){
        const {things, getKey, getValue} = this.props;

        // Deduplication
        var map = new Map(things.map(t => [getKey(t), getValue(t)]));

        // Search
        var matchingValues = new Map();
        if (this.needle && this.needle != '') {
            for (var [key,value] of map) {
                if (value.toLowerCase().includes(this.needle)) {
                    matchingValues.set(key, value);
                }
            }
        }
        else {
            matchingValues = map;
        }

        return matchingValues;
    }

    // === CHECKBOXES ===
    isChecked(key) {
        const {selectedKeys} = this.props;
        if (selectedKeys.length > 0) {
            if (selectedKeys.indexOf(key) > -1) {
                return true;
            }
        }
        return false;
    }

    getCheckboxRows(map) {
        const {onChecked, onUnchecked} = this.props;

        var counter = 0;
        var rows = [];

        if (map.size > 0) {
            for (const [key,value] of map) {

                // Checkbox props
                const checked = this.isChecked(key);
                function onChange(key) {
                    if (checked) onUnchecked(key);
                    else onChecked(key);
                }

                // Row render
                rows.push(
                    <tr key={key}>
                        <td><Checkbox onChange={()=>onChange(key)} defaultChecked={checked}/></td>
                        <td>{value}</td>
                    </tr>
                );

                if (counter++ > 10) break;
            }
        }
        else rows = <tr>
            <td><CenteredMessage>No values found.</CenteredMessage></td>
        </tr>;

        return rows;
    }

    // === RENDERING ===
    render() {
        var values = this.getMapToRender();
        var rows = this.getCheckboxRows(values);

        var resetEnabled = (this.needle && this.needle != '');

        return <div>
            <SubHeadLine title={this.props.header}/>
            <table>
                <tbody>
                <tr>
                    <td>SEARCH:</td>
                    <td><input type="text" name="search" onChange={()=>this.setNeedle()}/></td>
                    <td  align="left">
                        <Button raised={resetEnabled}
                                onTouchTap={()=>this.resetNeedle()}
                                disabled={!resetEnabled}
                                label="RESET"
                                align="left"
                        />
                    </td>
                    <td/>
                </tr>
                </tbody>
            </table>
            <br/>
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    }
}
export default ConfigToolbar;