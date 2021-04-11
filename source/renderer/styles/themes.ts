import { Colors } from "@blueprintjs/core";

interface AppTheme {
    dark: boolean;
    base: {
        bgColor: string;
    };
    sidebar: {
        button: {
            bgColor: string;
            borderColor: string;
        };
    };
    vaultChooser: {
        selectVaultAnchor: {
            color: string;
            hover: string;
        };
    };
}

export const THEME_DARK: AppTheme = {
    dark: true,
    base: {
        bgColor: Colors.DARK_GRAY4
    },
    sidebar: {
        button: {
            bgColor: Colors.DARK_GRAY4,
            borderColor: Colors.GRAY3
        }
    },
    vaultChooser: {
        selectVaultAnchor: {
            color: Colors.GRAY2,
            hover: Colors.GRAY3
        }
    }
};

export const THEME_LIGHT: AppTheme = {
    dark: false,
    base: {
        bgColor: "#fff"
    },
    sidebar: {
        button: {
            bgColor: Colors.DARK_GRAY4,
            borderColor: Colors.GRAY3
        }
    },
    vaultChooser: {
        selectVaultAnchor: {
            color: Colors.GRAY2,
            hover: Colors.GRAY3
        }
    }
};
