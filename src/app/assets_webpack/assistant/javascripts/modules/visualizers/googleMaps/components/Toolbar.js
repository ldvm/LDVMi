import React from "react";
import BodyPadding from "../../../../components/BodyPadding";
import OpenEmbedAppDialogButton from "./OpenEmbedAppDialogButton";
import RefreshMapButton from "../containers/RefreshMapButton";
import PublishSettingsContainer from "../containers/PublishSettingsContainer";
import SaveButton from "../containers/SaveButton";
import EmbedAppDialog from "../containers/EmbedAppDialog";

const Toolbar = () => {
    return <BodyPadding>
        <SaveButton />
        <OpenEmbedAppDialogButton />
        <RefreshMapButton  />
        <PublishSettingsContainer />

        <EmbedAppDialog />
    </BodyPadding>
};

export default Toolbar;
