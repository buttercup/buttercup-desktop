import * as React from "react";
import styled from "styled-components";
import { basename } from "path-posix";
import { Icon, IPanel, IPanelProps, IPanelStackProps, PanelStack, Spinner } from "@blueprintjs/core";
import { FileSystemInterface } from "@buttercup/file-interface";
// import { State, useState } from "@hookstate/core";
import { FSItem } from "../../library/fsInterface";

const { useCallback, useEffect, useState } = React;

interface DirectoryStatus {
    path: string;
    loading: boolean;
    contents: Array<FSItem>;
}

interface FileChooserPanelProps {
    // items: Array<FSItem>;
    status: DirectoryStatus;
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
    handleItemClick(evt, item: FSItem) {
        evt.preventDefault();
        if (item.type === "directory") {
            this.props.onEnterDirectory(item.identifier);
        }
    }

    render() {
        const { contents, loading } = this.props.status;
        return (
            <ChooserContents>
                {loading && (
                    <Spinner />
                )}
                {!loading ? contents.map(item => (
                    <ChooserItem key={item.identifier} onClick={evt => this.handleItemClick(evt, item)}>
                        <Icon
                            icon={item.type === "directory" ? "folder-close" : "document"}
                            iconSize={ICON_SIZE}
                            color={item.type === "directory" ? FOLDER_COLOUR : FILE_COLOUR}
                        />
                        <ChooserItemText>{item.name}</ChooserItemText>
                    </ChooserItem>
                )) : null}
            </ChooserContents>
        );
    }
}

export function FileChooser(props: FileChooserProps) {
    const [paths, setPaths] = useState<Record<string, DirectoryStatus>>({});
    const [pathStack, setPathStack] = useState<Array<IPanel>>([]);


    const addNewPath = useCallback(async path => {
        let _paths = paths,
            targetPathStatus;
        const hasPath = !!paths[path];
        if (hasPath) {
            targetPathStatus = paths[path];
        } else {
            targetPathStatus = {
                path,
                loading: true,
                contents: []
            };
            _paths = {
                ...paths,
                [path]: targetPathStatus
            };
            // setPaths(_paths);
            // return;
        }
        if (hasPath) {
            setPathStack(pathStack.map(pathStackItem => {
                if ((pathStackItem.props as FileChooserPanelProps).path !== path) return pathStackItem;
                return {
                    ...pathStackItem,
                    props: {
                        ...pathStackItem.props,
                        status: targetPathStatus
                    }
                };
            }));
            // setPathStack([
            //     ...pathStack,
            //     {
            //         component: FileChooserPanel,
            //         title: path,
            //         props: {
            //             status: targetPathStatus,
            //             onEnterDirectory: handleEnterDirectory,
            //             path
            //         }
            //     }
            // ]);
        } else {
            const results = await props.fsInterface.getDirectoryContents({
                identifier: path,
                name: basename(path)
            });
            const newStatus = {
                ...targetPathStatus,
                loading: false,
                contents: results
            };
            setPaths({
                ..._paths,
                [path]: newStatus
            });
            setPathStack([
                ...pathStack,
                {
                    component: FileChooserPanel,
                    title: path,
                    props: {
                        status: newStatus,
                        onEnterDirectory: handleEnterDirectory,
                        path
                    }
                }
            ]);
        }
    }, [paths, pathStack]);
    const handleEnterDirectory = useCallback(path => {
        addNewPath(path);
    }, [addNewPath, pathStack, paths]);
    const handlePanelClose = useCallback(() => {
        const newStack = [...pathStack];
        newStack.pop();
        setPathStack(newStack);
    }, [pathStack]);
    // useEffect(() => {
    //     let dirty = false;
    //     const newStack = pathStack.map(item => {
    //         const associatedPath = paths[(item.props as FileChooserPanelProps).path];
    //         if ((item.props as FileChooserPanelProps).status.loading && associatedPath && !associatedPath.loading) {
    //             dirty = true;
    //             return {
    //                 ...item,
    //                 props: {
    //                     ...item.props,
    //                     status: {
    //                         ...(item.props as FileChooserPanelProps).status,
    //                         loading: false,
    //                         contents: associatedPath.contents
    //                     }
    //                 }
    //             };
    //         }
    //         return item;
    //     });
    //     if (dirty) {
    //         console.log("SET PATH STACK (2)", Date.now());
    //         setPathStack(newStack);
    //     }
    // }, [paths, pathStack]);
    useEffect(() => {
        addNewPath("/");
    }, []);


    // const [addPath, setAddPath] = useState(null);
    // const fetchPath = useCallback(async (path, status = null) => {
    //     const thisStatus = status || {
    //         path,
    //         loading: true,
    //         contents: []
    //     };
    //     setPaths({
    //         ...paths,
    //         [path]: thisStatus
    //     });
    //     const results = await props.fsInterface.getDirectoryContents({
    //         identifier: path,
    //         name: basename(path)
    //     });
    //     setPaths({
    //         ...paths,
    //         [path]: {
    //             ...thisStatus,
    //             loading: false,
    //             contents: results
    //         }
    //     });
    // }, [paths]);
    // const handleEnterDirectory = useCallback(path => {
    //     if (paths[path]) return;
    //     fetchPath(path);
    //     setAddPath(path);
    // }, [fetchPath, pathStack]);
    // const handlePanelClose = useCallback(() => {
    //     const newStack = [...pathStack];
    //     newStack.pop();
    //     setPathStack(newStack);
    // }, [pathStack]);
    // useEffect(() => {
    //     fetchPath("/");
    // }, []);
    // useEffect(() => {
    //     if (Object.keys(paths).length === 0) {
    //         setPathStack([]);
    //         return;
    //     }
    //     if (pathStack.length === 0) {
    //         setPathStack([{
    //             component: FileChooserPanel,
    //             title: "/",
    //             props: {
    //                 status: paths["/"],
    //                 onEnterDirectory: handleEnterDirectory,
    //                 path: "/"
    //             }
    //         }]);
    //         return;
    //     }
    //     console.log("ADD STACK", [...pathStack], paths);
    //     const updatedStack: Array<IPanel> = pathStack.map(previousStack => ({
    //         ...previousStack,
    //         props: {
    //             ...previousStack.props,
    //             status: paths[(previousStack.props as FileChooserPanelProps).path]
    //         }
    //     }));
    //     if (addPath) {
    //         updatedStack.push({
    //             component: FileChooserPanel,
    //             title: addPath,
    //             props: {
    //                 status: paths[addPath],
    //                 onEnterDirectory: handleEnterDirectory,
    //                 path: addPath
    //             }
    //         });
    //         setAddPath(null);
    //     }
    //     setPathStack(updatedStack);
    // }, [paths, addPath]);
    console.log("PATH STACK", pathStack);
    if (pathStack.length === 0) return null;
    return (
        <Chooser
            onClose={handlePanelClose}
            showPanelHeader
            stack={pathStack}
        />
    );
}
