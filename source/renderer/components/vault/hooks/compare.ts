import { DependencyList, EffectCallback, useEffect } from "react";
import { isVaultFacade } from "buttercup";

export function useDeepEffect(callback: EffectCallback, dependencies: DependencyList = []) {
    useEffect(
        callback,
        dependencies.map((dep) => (isVaultFacade(dep) ? dep._tag : dep))
    );
}
