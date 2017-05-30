import React from "react";
import {Route} from "react-router";
import {MODULE_PREFIX} from "./prefix";
import Intervals from "../../pages/Intervals";

export default function createRoutes(dispatch) {
    return (
        <Route component={Intervals} path={MODULE_PREFIX}/>
    );
}
