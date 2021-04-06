import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ipc";
import { initialise } from "./services/init";
import { App } from "./App";
import { logErr } from "./library/log";

import "../../resources/styles.sass";

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

initialise().catch(err => {
    logErr("Failed initialising", err);
});
