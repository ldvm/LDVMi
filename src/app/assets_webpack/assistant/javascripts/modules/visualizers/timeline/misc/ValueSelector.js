import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect";
import { getLabels, labelsSelector} from "../../../app/ducks/labels"
import { langSelector } from "../../../app/ducks/lang"

import { Map  as immutableMap} from 'immutable'

import Checkbox from "../../../../components/Checkbox"
import Button from "../../../../components/Button"
import SubHeadLine from "../../../../components/Subheadline"
import CenteredMessage from "../../../../components/CenteredMessage";
import LocalizedValue from "../../../app/containers/LocalizedValue";
import {extractFromLocalizedValue} from "../../../app/misc/languageUtils";

class ValueSelector extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        labels: PropTypes.instanceOf(immutableMap).isRequired,
        language: PropTypes.string.isRequired,

        things: PropTypes.array.isRequired,
        header: PropTypes.string.isRequired,

        getKey: PropTypes.func.isRequired,
        selectedKeys: PropTypes.array.isRequired,

        onChecked: PropTypes.func.isRequired,
        onUnchecked: PropTypes.func.isRequired
    };

    // SEARCH
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

    getSearchComponent(){
        var resetEnabled = (this.needle && this.needle != '');
        return <table>
            <tbody>
            <tr>
                <td>SEARCH:</td>
                <td><input type="text" name="search" onChange={()=>this.setNeedle()}/></td>
                <td>
                    <Button raised={resetEnabled}
                            onTouchTap={()=>this.resetNeedle()}
                            disabled={!resetEnabled}
                            label="RESET"
                    />
                </td>
                <td/>
            </tr>
            </tbody>
        </table>
    }

    // === CHECKBOX LIST ===
    isChecked(key) {
        const {selectedKeys} = this.props;
        if (selectedKeys.length > 0) {
            if (selectedKeys.indexOf(key) > -1) {
                return true;
            }
        }
        return false;
    }

    getLabel(key){
        const {dispatch,labels} = this.props;
        if (!labels.has(key)) {
            dispatch(getLabels([key]));
            return key;
        }
        else {
            return extractFromLocalizedValue(this.props.language, labels.get(key), key);
        }
    }

    getMatchingRecords(map) {
        var matchingValues = new Map();

        for (const [key, value] of map) {
            if (value.toLowerCase().includes(this.needle)) {
                matchingValues.set(key, value);
            }
        }

        return matchingValues;
    }

    getValuesForVisualization(){
        const {things, getKey} = this.props;

        // Deduplication
        var map = new Map(things.map(t => {
            var key = getKey(t);
            return [key, this.getLabel(key)]
        }));

        // Needle Search
        if (this.needle && this.needle != '') {
            return this.getMatchingRecords(map);
        }
        else return map;
    }

    getCheckboxRows() {
        const {onChecked, onUnchecked} = this.props;

        var valuesMap = this.getValuesForVisualization();

        var counter = 0;
        var rows = [];

        if (valuesMap.size > 0) {
            for (const [key,value] of valuesMap) {

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
                        <td><LocalizedValue localizedValue={value} defaultValue={key}/></td>
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
        return <div>
            <SubHeadLine title={this.props.header}/>
            {this.getSearchComponent()}
            <br/>
            <table>
                <tbody>
                {this.getCheckboxRows()}
                </tbody>
            </table>
        </div>
    }
}
const selector = createStructuredSelector({
    labels: labelsSelector,
    language: langSelector
});

export default connect(selector)(ValueSelector);