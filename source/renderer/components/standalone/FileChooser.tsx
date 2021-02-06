import * as React from "react";
import styled from "styled-components";
import { basename } from "path-posix";
import { Icon, IPanel, IPanelProps, IPanelStackProps, PanelStack } from "@blueprintjs/core";
import { FileSystemInterface } from "@buttercup/file-interface";
import { State, useState } from "@hookstate/core";
import { FSItem } from "../../library/fsInterface";

const { useCallback, useEffect } = React;

interface FileChooserPanelProps {
    // items: Array<FSItem>;
    items: Array<FSItem>;
    onEnterDirectory: (path: string) => void;
    path: string;
    // pathsLoading: State<Array<string>>;
    // pathsLoaded: State<Record<string, Array<FSItem>>>;
}

interface FileChooserProps {
    callback: (path: string | null) => void;
    fsInterface: FileSystemInterface;
}

const FILE_COLOUR = "#222";
const FOLDER_COLOUR = "#F7D774";
const ICON_SIZE = 34;
const ITEM_WIDTH = 75;

const CHOOSER_WIDTH = ITEM_WIDTH * 6 + 10;

const Chooser = styled(PanelStack)`
    width: 100%;
    min-width: ${CHOOSER_WIDTH}px;
    height: 100%;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-items: space-between;
    align-items: stretch;
`;
const ChooserContents = styled.div`
    flex: 10 10 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 4px;
`;
const ChooserItem = styled.div`
    width: ${ITEM_WIDTH}px;
    max-width: ${ITEM_WIDTH}px;
    min-width: ${ITEM_WIDTH}px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
    cursor: pointer;

    &:hover {
        background-color: #ddd;
    }
`;
const ChooserItemText = styled.div`
    text-align: center;
    font-weight: 450;
    font-size: 80%;
    overflow-wrap: break-word;
    width: 80%;
    margin-top: 4px;
    user-select: none;
`;

class FileChooserPanel extends React.Component<IPanelProps & IPanelStackProps & FileChooserPanelProps> {
    // componentDidUpdate(prevProps) {
    //     console.log("DID UPDATE", {
    //         props: this.props,
    //         prevProps
    //     });
    // }

    handleItemClick(evt, item: FSItem) {
        evt.preventDefault();
        if (item.type === "directory") {
            this.props.onEnterDirectory(item.identifier);
        }
    }

    render() {
        const { items } = this.props;
        // const items = []
        // const loadedPaths = this.props.pathsLoaded.get();
        // const items = Array.isArray(loadedPaths[this.props.path])
        //     ? loadedPaths[this.props.path]
        //     : [];
        console.log("ITEMS", items);
        return (
            <ChooserContents>
                {items.map(item => (
                    <ChooserItem key={item.identifier} onClick={evt => this.handleItemClick(evt, item)}>
                        <Icon
                            icon={item.type === "directory" ? "folder-close" : "document"}
                            iconSize={ICON_SIZE}
                            color={item.type === "directory" ? FOLDER_COLOUR : FILE_COLOUR}
                        />
                        <ChooserItemText>{item.name}</ChooserItemText>
                    </ChooserItem>
                ))}
                {/* <ChooserItem>
                    <Icon icon="folder-close" iconSize={ICON_SIZE} color={FOLDER_COLOUR} />
                    <ChooserItemText>My Folder</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="folder-close" iconSize={ICON_SIZE} color={FOLDER_COLOUR} />
                    <ChooserItemText>Another</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="folder-close" iconSize={ICON_SIZE} color={FOLDER_COLOUR} />
                    <ChooserItemText>This is a long name</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>example.doc</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>taxes.xlsx</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>Funny stuff.url</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>Stupid-really-long-web-clip.gif</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>vault.bcup</ChooserItemText>
                </ChooserItem>
                <ChooserItem>
                    <Icon icon="document" iconSize={ICON_SIZE} />
                    <ChooserItemText>dump.rdb</ChooserItemText>
                </ChooserItem> */}
            </ChooserContents>
        );
    }
}

export function FileChooser(props: FileChooserProps) {
    const pathsLoading = useState([] as Array<string>);
    const pathsLoaded = useState({} as Record<string, Array<FSItem>>);
    const pathStack = useState([] as Array<IPanel>);
    const fetchPath = useCallback(async path => {
        pathsLoading.set([
            ...pathsLoading.get(),
            path
        ]);
        const results = await props.fsInterface.getDirectoryContents({
            identifier: path,
            name: basename(path)
        });
        pathsLoaded.set({
            ...pathsLoaded.get(),
            [path]: results
        });
        pathsLoading.set(pathsLoading.get().filter(item => item !== path));
    }, [pathsLoading, pathsLoaded]);
    const handleEnterDirectory = useCallback(path => {
        if (pathsLoaded.get().hasOwnProperty(path) || pathsLoading.get().includes(path)) return;
        fetchPath(path);
    }, [fetchPath, pathsLoaded, pathsLoading]);
    useEffect(() => {
        // pathStack.set([{
        //     component: FileChooserPanel,
        //     title: "/",
        //     props: {
        //         items: [],
        //         onEnterDirectory: handleEnterDirectory,
        //         path: "/"
        //     }
        // }]);
        fetchPath("/");
    }, []);
    useEffect(() => {
        const panelItems = [...pathStack.get()];
        for (const pi in panelItems) {
            const panelProps = panelItems[pi].props as FileChooserPanelProps;
            panelItems[pi] = {
                ...panelItems[pi],
                props: {
                    ...panelProps,
                    items: pathsLoading.get()[panelProps.path] || !pathsLoaded.get()[panelProps.path]
                        ? []
                        : [...pathsLoaded.get()[panelProps.path]]
                }
            };
        }
        console.log("SET!", [...panelItems]);
        pathStack.set(panelItems);
    }, [pathsLoaded.get(), pathsLoading.get()]);
    if (pathStack.get().length === 0) return null;
    return (
        <Chooser
            stack={pathStack.get()}
        />
    );
    // console.log(pathsLoaded.get());
    // return (
    //     <Chooser initialPanel={{
    //         component: FileChooserPanel,
    //         title: "/",
    //         props: {
    //             // items: Array.isArray(pathsLoaded.get()["/"]) ? [...pathsLoaded.get()["/"]] : [],
    //             onEnterDirectory: path => {
    //                 if (pathsLoaded.get().hasOwnProperty(path) || pathsLoading.get().includes(path)) return;
    //                 fetchPath(path);
    //             },
    //             path: "/",
    //             pathsLoading,
    //             pathsLoaded
    //         }
    //     }} />
    // );
}
