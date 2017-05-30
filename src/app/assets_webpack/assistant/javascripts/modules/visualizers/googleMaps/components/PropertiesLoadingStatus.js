import React, {PropTypes} from "react";
import Paper from "material-ui/Paper";
import Alert from "../../../../components/Alert";
import LinearProgress from "../../../../components/LinearProgress";
import Padding from "../../../../components/Padding";
import PaperCard from "../../../../components/PaperCard";
import {PromiseStatus} from "../../../core/models";

const PropertiesLoadingStatus = ({status}) => {
    if (status.isLoading) {
        return <PaperCard title="Querying dataset"
                          subtitle="Right now, we are querying the dataset for properties of geolocated entities.">
            <LinearProgress />
            <p>
                <small>It may take a few minutes based on the size of the result and/or size of the graph the
                    query is running against.
                </small>
            </p>
        </PaperCard>
    }

    if (status.error) {
        return <Paper zDepth={2}>
            <Padding space={2}>
                <Alert danger>{status.error}</Alert>
            </Padding>
        </Paper>
    }

    return <span />;
};

PropertiesLoadingStatus.propTypes = {
    status: PropTypes.instanceOf(PromiseStatus).isRequired
};

export default PropertiesLoadingStatus;
