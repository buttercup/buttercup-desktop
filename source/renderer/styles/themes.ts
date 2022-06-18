import { Colors } from "@blueprintjs/core";

interface AppTheme {
    dark: boolean;
    base: {
        bgColor: string;
        contentBgColor: string;
    };
    sidebar: {
        button: {
            bgColor: string;
            borderColor: string;
        };
        hoverName: {
            bgColor: string;
            color: string;
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
        bgColor: Colors.DARK_GRAY4,
        contentBgColor: Colors.DARK_GRAY3
    },
    sidebar: {
        button: {
            bgColor: Colors.DARK_GRAY4,
            borderColor: Colors.GRAY3
        },
        hoverName: {
            bgColor: Colors.DARK_GRAY4,
            color: Colors.LIGHT_GRAY2
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
        bgColor: Colors.LIGHT_GRAY4,
        contentBgColor: Colors.LIGHT_GRAY5
    },
    sidebar: {
        button: {
            bgColor: Colors.DARK_GRAY4,
            borderColor: Colors.GRAY3
        },
        hoverName: {
            bgColor: "#fff",
            color: Colors.GRAY2
        }
    },
    vaultChooser: {
        selectVaultAnchor: {
            color: Colors.GRAY2,
            hover: Colors.GRAY3
        }
    }
};
