import * as React from "react";
import { VaultFacade } from "buttercup";
import { getCurrentFacade, getFacadeEmitter } from "../services/facade";

const { useEffect, useState } = React;

export function useCurrentFacade(): VaultFacade {
    const emitter = getFacadeEmitter();
    const [facade, setFacade] = useState<VaultFacade>(null);
    useEffect(() => {
        const cb = () => {
            setFacade(getCurrentFacade());
        };
        emitter.on("facadeUpdated", cb);
        return () => {
            emitter.off("facadeUpdated", cb);
        };
    }, [emitter]);
    return facade;
}
