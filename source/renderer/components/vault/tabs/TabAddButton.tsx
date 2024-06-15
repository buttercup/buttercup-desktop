import React, { useCallback } from "react";
import { Icon } from "@blueprintjs/core";
import styled, { useTheme } from "styled-components";
import { getThemeProp } from "../utils/theme";

export const TAB_HEIGHT = 38;

const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-right: 4px;
    margin-bottom: -1px;
    margin-left: 4px;
    position: relative;
`;

const TabInner = styled.div`
    background-color: ${p => getThemeProp(p, "tab.background")};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    padding: 0px 8px;
	border: 1px solid ${p => getThemeProp(p, "tab.border")};
    height: ${TAB_HEIGHT}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transition: all .25s;
    cursor: pointer;

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.backgroundSelected")};
    }
`;

const TabContent = styled.span`
    transition: all .25s;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    pointer-events: none;
`;

export function TabAddButton(props: {
    onClick: () => void;
}) {
    const {
        onClick
    } = props;
    const theme = useTheme();
    const handleClick = useCallback((event) => {
        if (event.button === 0) {
            event.preventDefault();
            onClick();
        }
    }, [onClick]);
    return (
        <TabContainer>
            <TabInner
                onClick={handleClick}
                role="button"
            >
                <TabContent>
                    <Icon
                        color={getThemeProp({ theme }, "tab.close")}
                        icon="plus"
                    />
                </TabContent>
            </TabInner>
        </TabContainer>
    );
}
