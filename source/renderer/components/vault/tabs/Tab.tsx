import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Colors, Icon } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import styled, { useTheme } from "styled-components";
import { getThemeProp } from "../utils/theme";

export const TAB_HEIGHT_NORMAL = 38;
export const TAB_HEIGHT_SELECTED = 41;

const TAB_ICON_OFFSET = 2;
const TAB_ICON_SIZE = 20;
const TAB_INDICATOR_SIZE = 5;

const Close = styled(Icon)`
    margin-left: 8px;
    padding: 3px;
    border-radius: 50%;
    flex: 0 0 auto;

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.closeBackgroundHover")};
    }
`;

const DropTarget = styled.div<{
    isOver?: boolean;
    side: "left" | "right";
}>`
    height: ${TAB_HEIGHT_NORMAL}px;
    position: absolute;
    width: ${p => p.isOver ? "calc(50% + 104px)" : "calc(50% + 4px)"};
    ${p => p.side}: ${p => p.isOver ? "-104px" : "-4px"};
    top: 0px;
    transition: all 0.3s;
`;

const TabContainer = styled.div<{
    isOverLeft?: boolean;
    isOverRight?: boolean;
}>`
    flex: 0 1 auto;
    min-width: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-right: ${p => p.isOverRight ? "104px" : "4px"};
    margin-bottom: -1px;
    margin-left: ${p => p.isOverLeft ? "104px" : "4px"};
    position: relative;
`;

const TabInner = styled.div<{
    selected?: boolean;
}>`
    background-color: ${p => p.selected ? getThemeProp(p, "tab.backgroundSelected") : getThemeProp(p, "tab.background")};
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    padding: 0px 10px;
	border: 1px solid ${p => getThemeProp(p, "tab.border")};
    height: ${TAB_HEIGHT_NORMAL}px;
    width: 140px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition: all .25s;
    cursor: pointer;
    ${p => p.selected ? `
        height: ${TAB_HEIGHT_SELECTED}px;
        border-bottom: none;
    ` : ""}

    &:hover {
        background-color: ${p => getThemeProp(p, "tab.backgroundSelected")};
    }
`;

const TabContent = styled.div`
    transition: all .25s;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;
    pointer-events: none;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    flex: 1 1 auto;
    min-width: 0px;
`;

const TabIcon = styled.img`
    width: ${TAB_ICON_SIZE}px;
    height: ${TAB_ICON_SIZE}px;
    pointer-events: none;
`;

const TabIconContainer = styled.div`
    flex: 0 0 auto;
    width: ${TAB_ICON_SIZE + TAB_ICON_OFFSET + TAB_INDICATOR_SIZE}px;
    height: ${TAB_ICON_SIZE}px;
    margin-right: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: relative;
`;

const TabIconIndicator = styled.div<{
    available?: boolean;
}>`
    position: absolute;
    width: ${TAB_INDICATOR_SIZE}px;
    height: ${TAB_INDICATOR_SIZE}px;
    background-color: ${Colors.GREEN3};
    border-radius: 50%;
    overflow: hidden;
    right: 0px;
    top: calc(50% - ${TAB_INDICATOR_SIZE / 2}px);
    opacity: ${p => p.available ? 1 : 0};
`;

function OptionalMenu(props: {
    children: ReactElement;
    id: string;
    menu?: (props: { id: string; }) => JSX.Element
}) {
    const { children, id, menu: Menu } = props;
    if (!Menu) {
        return (
            <>
                {children}
            </>
        );
    }
    return (
        <ContextMenu2 content={<Menu id={id} />}>
            {children}
        </ContextMenu2>
    );
}

export function Tab(props: {
    available?: boolean;
    content: string;
    icon: string;
    id: string;
    menu: (props: { id: string; }) => JSX.Element;
    onClose: () => void;
    onDraggingChange: (tabID: string, isDragging: boolean) => void;
    onSelect: () => void;
    onTabReorder: (tabID: string, newOrder: number) => void;
    selected: boolean;
    tabDragging: string | null;
}) {
    const {
        available = false,
        content,
        icon,
        id,
        menu,
        onClose,
        onDraggingChange,
        onSelect,
        onTabReorder,
        selected,
        tabDragging
    } = props;
    const theme = useTheme();
    const [wasDragging, setWasDragging] = useState(false);
    const handleClose = useCallback((event) => {
        event.stopPropagation();
        onClose()
    }, [onClose]);
    const handleClick = useCallback((event) => {
        if (event.button === 0) {
            event.preventDefault();
            onSelect();
        } else if (event.button === 1) {
            handleClose(event);
        }
    }, [handleClose, id, onSelect]);
    const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(() => ({
        type: "BOX",
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: {
            id
        }
    }));
    const [{ isOver: isOverLeft }, dropLeftRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item: any) => {
            onTabReorder(item.id, -1);
        }
    }), [onTabReorder]);
    const [{ isOver: isOverRight }, dropRightRef] = useDrop(() => ({
        accept: "BOX",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        drop: (item: any) => {
            onTabReorder(item.id, 1);
            setWasDragging(false);
            onDraggingChange(id, false);
        }
    }), [onDraggingChange, onTabReorder]);
    useEffect(() => {
        if (isDragging && !wasDragging) {
            setWasDragging(true);
            onDraggingChange(id, true);
        } else if (!isDragging) {
            setWasDragging(false);
            onDraggingChange(id, false);
        }
    }, [id, isDragging, wasDragging, tabDragging]);
    return (
        <TabContainer
            isOverLeft={isOverLeft}
            isOverRight={isOverRight}
            title={content}
        >
            {tabDragging && (
                <DropTarget isOver={isOverLeft} ref={dropLeftRef} side="left">&nbsp;</DropTarget>
            )}
            <OptionalMenu id={id} menu={menu}>
                <TabInner
                    onClick={handleClick}
                    ref={isDragging ? dragPreviewRef : dragRef}
                    role="button"
                    selected={selected}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                >
                    <TabIconContainer>
                        <TabIcon src={icon} />
                        <TabIconIndicator available={available} />
                    </TabIconContainer>
                    <TabContent>{content}</TabContent>
                    <Close
                        color={getThemeProp({ theme }, "tab.close")}
                        icon="small-cross"
                        onClick={handleClose}
                        role="button"
                    />
                </TabInner>
            </OptionalMenu>
            {tabDragging && (
                <DropTarget isOver={isOverRight} ref={dropRightRef} side="right">&nbsp;</DropTarget>
            )}
        </TabContainer>
    );
}
