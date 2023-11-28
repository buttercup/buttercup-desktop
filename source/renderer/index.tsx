import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import "./ipc";
import { initialise } from "./services/init";
import { App } from "./App";
import { logErr, logInfo } from "./library/log";

import "../../resources/styles.sass";

(async function() {
    const root = document.getElementById("root");
    assert(!!root, "No root element found");
    await initialise(root);
    logInfo("Rendering application");
    ReactDOM.render(<App />, root);
})().catch(err => {
    logErr("Failed initialising", err);
});
