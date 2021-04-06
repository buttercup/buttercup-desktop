import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ipc";
import { initialise } from "./services/init";
import { App } from "./App";
import { logErr, logInfo } from "./library/log";

import "../../resources/styles.sass";

const root = document.getElementById("root");

initialise()
    .then(() => {
        logInfo("Rendering application");
        ReactDOM.render(<App />, root);
    })
    .catch(err => {
        logErr("Failed initialising", err);
    });
