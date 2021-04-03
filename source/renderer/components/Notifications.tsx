import React from "react";
import { Position, Toaster } from "@blueprintjs/core";

const { useCallback } = React;

let __toasterRef: Toaster,
    __updateToasterRef: Toaster;

export function getToaster(): Toaster {
    return __toasterRef;
}

export function getUpdateToaster(): Toaster {
    return __updateToasterRef;
}

export function Notifications() {
    const onRef = useCallback((toasterRef: Toaster) => {
        __toasterRef = toasterRef;
    }, []);
    const onUpdateRef = useCallback((toasterRef: Toaster) => {
        __updateToasterRef = toasterRef;
    }, []);
    return (
        <>
            <Toaster position={Position.TOP_RIGHT} usePortal={false} ref={onRef} />
            <Toaster position={Position.BOTTOM_RIGHT} usePortal={false} ref={onUpdateRef} />
        </>
    );
}
