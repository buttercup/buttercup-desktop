import { nativeTheme } from "@electron/remote";
import * as React from "react";
import { getThemeType } from "../library/theme";
import { Theme } from "../types";

const { useEffect, useState } = React;

export function useTheme(): Theme {
    const [theme, setTheme] = useState<Theme>(getThemeType());
    useEffect(() => {
        const callback = () => {
            setTheme(getThemeType());
        };
        nativeTheme.on("updated", callback);
        return () => {
            nativeTheme.off("updated", callback);
        };
    }, []);
    return theme;
}
