import React from "react";
import {Route} from "react-router";
import Coordinates from "../../pages/Coordinates";
import {MODULE_PREFIX} from "./prefix";

export default function createRoutes(dispatch) {
    return (
        <Route component={Coordinates} path={MODULE_PREFIX}/>
    );
}
