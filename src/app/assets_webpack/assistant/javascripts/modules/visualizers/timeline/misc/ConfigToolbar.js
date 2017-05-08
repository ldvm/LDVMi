import React, { Component, PropTypes } from 'react'

class ConfigToolbar extends Component {
    static propTypes = {
        things: PropTypes.array.isRequired,
        label: PropTypes.string.isRequired,

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
        const {things,getKey, getValue} = this.props;

        // Deduplication
        function getKVP(t){
            return [getKey(t), getValue(t)];
        }
        var map = new Map(things.map(t => getKVP(t)));

        // Search
        var matchingValues = new Map();
        if (this.needle && this.needle != '') {
            for (var [key,value] of map) {
                if (value.toLowerCase().startsWith(this.needle)) {
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
                        <td><input type='checkbox' onChange={()=>onChange(key)} defaultChecked={checked}/></td>
                        <td>{value}</td>
                    </tr>
                );

                if (counter++ > 10) break;
            }
        }
        else rows = <tr>
            <td>No values found. Try increasing the limit.</td>
        </tr>;

        return rows;
    }

    // === RENDERING ===
    render() {
        var values = this.getMapToRender();
        var rows = this.getCheckboxRows(values);

        return <div>
            <table>
                <thead>
                <tr>
                    <th><input type="text"   name="search"/></th>
                    <th><input type="button" name="search_go"    value="SEARCH" onClick={()=>this.setNeedle()}/></th>
                    <th><input type="button" name="search_reset" value="RESET"  onClick={()=>this.resetNeedle()}/></th>
                </tr>
                </thead>
            </table>

            <br/>

            <table>
                <thead>
                <tr>
                    <th>SELECT</th>
                    <th>{this.props.label}</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    }
}
export default ConfigToolbar;