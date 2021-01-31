import * as React from "react";
import { Position, Toaster } from "@blueprintjs/core";

const { useCallback } = React;

let __toasterRef: Toaster;

export function getToaster(): Toaster {
    return __toasterRef;
}

export function Notifications() {
    const onRef = useCallback((toasterRef: Toaster) => {
        __toasterRef = toasterRef;
    }, []);
    return (
        <Toaster position={Position.TOP_RIGHT} ref={onRef} />
    );
}
