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
    vault: {
        list: {
            focusedBackgroundColor: string;
            selectedBackgroundColor: string;
            selectedTextColor: string;
        };
        colors: {
            divider: string;
            paneDivider: string;
            uiBackground: string;
            mainPaneBackground: string;
        };
        tree: {
            selectedBackgroundColor: string;
            hoverBackgroundColor: string;
            selectedTextColor: string;
            selectedIconColor: string;
        };
        entry: {
            primaryContainer: string;
            separatorTextColor: string;
            separatorBorder: string;
            fieldHoverBorder: string;
        };
        attachment: {
            dropBackground: string;
            dropBorder: string;
            dropText: string;
        };
        tab: {
            background: string;
            backgroundSelected: string;
            barBackground: string;
            border: string;
            close: string;
            closeBackgroundHover: string;
            dropBorder: string;
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
    vault: {
        list: {
            focusedBackgroundColor: Colors.DARK_GRAY5,
            selectedBackgroundColor: Colors.TURQUOISE3,
            selectedTextColor: "#fff"
        },
        colors: {
            divider: Colors.DARK_GRAY5,
            paneDivider: Colors.GRAY3,
            uiBackground: Colors.DARK_GRAY2,
            mainPaneBackground: Colors.DARK_GRAY3
        },
        tree: {
            selectedBackgroundColor: Colors.DARK_GRAY5,
            hoverBackgroundColor: "transparent",
            selectedTextColor: Colors.LIGHT_GRAY5,
            selectedIconColor: Colors.LIGHT_GRAY5
        },
        entry: {
            primaryContainer: Colors.DARK_GRAY3,
            separatorTextColor: Colors.GRAY3,
            separatorBorder: Colors.GRAY1,
            fieldHoverBorder: Colors.GRAY1
        },
        attachment: {
            dropBackground: Colors.DARK_GRAY3,
            dropBorder: Colors.DARK_GRAY5,
            dropText: Colors.GRAY2
        },
        tab: {
            background: Colors.DARK_GRAY2,
            backgroundSelected: Colors.DARK_GRAY3,
            barBackground: Colors.DARK_GRAY1,
            border: Colors.GRAY1,
            close: Colors.GRAY3,
            closeBackgroundHover: Colors.DARK_GRAY5,
            dropBorder: Colors.GRAY1
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
    vault: {
        list: {
            focusedBackgroundColor: Colors.LIGHT_GRAY5,
            selectedBackgroundColor: Colors.TURQUOISE3,
            selectedTextColor: "#fff"
        },
        colors: {
            divider: Colors.LIGHT_GRAY4,
            paneDivider: Colors.GRAY3,
            uiBackground: Colors.LIGHT_GRAY5,
            mainPaneBackground: Colors.LIGHT_GRAY4
        },
        tree: {
            selectedBackgroundColor: Colors.LIGHT_GRAY2,
            hoverBackgroundColor: "transparent",
            selectedTextColor: Colors.DARK_GRAY1,
            selectedIconColor: Colors.DARK_GRAY5
        },
        entry: {
            primaryContainer: Colors.LIGHT_GRAY4,
            separatorTextColor: Colors.GRAY3,
            separatorBorder: Colors.LIGHT_GRAY2,
            fieldHoverBorder: Colors.LIGHT_GRAY1
        },
        attachment: {
            dropBackground: Colors.LIGHT_GRAY5,
            dropBorder: Colors.LIGHT_GRAY2,
            dropText: Colors.GRAY4
        },
        tab: {
            background: Colors.LIGHT_GRAY2,
            backgroundSelected: Colors.LIGHT_GRAY3,
            barBackground: Colors.LIGHT_GRAY4,
            border: Colors.GRAY4,
            close: Colors.GRAY1,
            closeBackgroundHover: Colors.LIGHT_GRAY1,
            dropBorder: Colors.GRAY5
        }
    },
    vaultChooser: {
        selectVaultAnchor: {
            color: Colors.GRAY2,
            hover: Colors.GRAY3
        }
    }
};
