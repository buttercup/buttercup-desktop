import { Colors } from "@blueprintjs/core";

interface AppTheme {
    dark: boolean;
    base: {
        bgColor: string;
    }
}

export const THEME_DARK: AppTheme = {
    dark: true,
    base: {
        bgColor: Colors.DARK_GRAY4
    }
};

export const THEME_LIGHT: AppTheme = {
    dark: false,
    base: {
        bgColor: "#fff"
    }
};
