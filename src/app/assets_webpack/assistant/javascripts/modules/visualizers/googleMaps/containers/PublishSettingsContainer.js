import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PublishSettings} from "../models";
import {publishSettingsSelector, updatePublishSettings} from "../ducks/publishSettings";
import PublishSettingsMenu from "../components/PublishSettingsMenu";

const PublishSettingsContainer = ({dispatch, publishSettings}) => {
    return <PublishSettingsMenu
        updatePublishSettings={update => dispatch(updatePublishSettings(update))}
        publishSettings={publishSettings}
    />
};

PublishSettingsContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    publishSettings: PropTypes.instanceOf(PublishSettings)
};

const selector = createStructuredSelector({
    publishSettings: publishSettingsSelector
});

export default connect(selector)(PublishSettingsContainer);
