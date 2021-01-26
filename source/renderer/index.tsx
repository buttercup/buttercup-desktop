import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ipc";
import { initialise } from "./services/init";
import { App } from "./App";

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

initialise();
