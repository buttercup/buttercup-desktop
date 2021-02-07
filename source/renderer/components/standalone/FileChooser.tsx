import * as React from "react";
import styled from "styled-components";
import { basename } from "path-posix";
import { Alignment, Breadcrumb, Breadcrumbs, Button, IBreadcrumbProps, Icon, Navbar, Spinner } from "@blueprintjs/core";
import { FileSystemInterface } from "@buttercup/file-interface";
import { FSItem } from "../../library/fsInterface";

const { useCallback, useEffect, useState } = React;

interface BreadcrumbProps {
    text: string;
    path: string;
}

interface FileChooserProps {
    callback: (path: string | null) => void;
    fsInterface: FileSystemInterface;
}

const FILE_COLOUR = "#222";
const FOLDER_COLOUR = "#F7D774";
const ICON_SIZE = 34;
const ITEM_WIDTH = 75;

const CHOOSER_WIDTH = ITEM_WIDTH * 8 + 10;

const Chooser = styled.div`
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

export function FileChooser(props: FileChooserProps) {
    const [currentItems, setCurrentItems] = useState<Array<FSItem>>([]);
    const [currentPath, setCurrentPath] = useState("/");
    const [loading, setLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbProps>>([]);
    const loadPath = useCallback(async path => {
        setLoading(true);
        const results = await props.fsInterface.getDirectoryContents({
            identifier: path,
            name: basename(path)
        });
        setCurrentItems(results);
        setLoading(false);
    }, []);
    const handleItemClick = useCallback((item: FSItem) => {
        if (item.type === "file") {
            // @todo
        } else {
            setBreadcrumbs([
                ...breadcrumbs,
                {
                    text: currentPath === "/" ? "/" : basename(currentPath),
                    path: currentPath
                }
            ]);
            loadPath(item.identifier);
            setCurrentPath(item.identifier);
        }
    }, [breadcrumbs, currentPath]);
    const handlePreviousPathClick = useCallback((event, path: string) => {
        event.preventDefault();
        setBreadcrumbs(breadcrumbs.filter(bc => bc.path.length < path.length));
        loadPath(path);
        setCurrentPath(path);
    }, [breadcrumbs]);
    const renderBreadcrumb = useCallback(({ text, ...restProps }: IBreadcrumbProps) => (
            <Breadcrumb {...restProps}>
                {text}
            </Breadcrumb>
        ),
        []
    );
    useEffect(() => {
        loadPath("/");
    }, []);
    return (
        <Chooser>
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Button className="bp3-minimal" icon="new-object" text="New Vault" />
                    <Navbar.Divider />
                    <Breadcrumbs
                        currentBreadcrumbRenderer={renderBreadcrumb as any}
                        items={[
                            ...breadcrumbs.map(bc => ({
                                text: bc.text,
                                onClick: evt => handlePreviousPathClick(evt, bc.path)
                            })),
                            {
                                text: currentPath === "/" ? "/" : basename(currentPath)
                            }
                        ]}
                        minVisibleItems={1}
                    />
                </Navbar.Group>
            </Navbar>
            <ChooserContents>
                {loading && (
                    <Spinner />
                )}
                {!loading && currentItems.map(item => (
                    <ChooserItem key={item.identifier} onClick={() => handleItemClick(item)}>
                        <Icon
                            icon={item.type === "directory" ? "folder-close" : "document"}
                            iconSize={ICON_SIZE}
                            color={item.type === "directory" ? FOLDER_COLOUR : FILE_COLOUR}
                        />
                        <ChooserItemText>{item.name}</ChooserItemText>
                    </ChooserItem>
                ))}
            </ChooserContents>
        </Chooser>
    );
}
