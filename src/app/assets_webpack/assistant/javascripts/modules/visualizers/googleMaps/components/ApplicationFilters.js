import React, {PropTypes} from "react";
import {Map} from "immutable";
import Paper from "material-ui/Paper";
import RefreshMapButton from "../containers/RefreshMapButton";
import FillInScreen from "../../../../components/FillInScreen";
import Padding from "../../../../components/Padding";
import FilterPreview from "../containers/FilterPreview";
import ExpandableFilters from "./ExpandableFilters";
import NoFiltersAvailable from "./NoFiltersAvailable";

const ApplicationFilters = ({filters, expandable}) => {

    return <Paper zDepth={2}>
        <ExpandableFilters expandable={expandable}>
            <FillInScreen marginBottom={100}>
                <div>
                    {filters.size == 0 && <NoFiltersAvailable />}
                    {filters.toList().map(filter =>
                        <div key={filter.property.uri}>
                            <FilterPreview filter={filter}/>
                        </div>
                    )}
                </div>
            </FillInScreen>
            <Padding space={2}>
                <RefreshMapButton fullWidth/>
            </Padding>
        </ExpandableFilters>
    </Paper>
};

ApplicationFilters.propTypes = {
    filters: PropTypes.instanceOf(Map),
    expandable: PropTypes.bool.isRequired
};

export default ApplicationFilters;
