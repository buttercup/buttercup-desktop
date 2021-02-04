import * as React from "react";
import styled from "styled-components";
import { Icon, IPanelProps, PanelStack } from "@blueprintjs/core";
import { FileSystemInterface } from "@buttercup/file-interface";
import { useState } from "@hookstate/core";
import { FSItem } from "../../library/fsInterface";

interface FileChooserPanelProps {
    items: Array<FSItem>;
    // onEnterDirectory: (dirName: string) => void;
    path: string;
}

interface FileChooserProps {
    callback: (path: string | null) => void;
    fsInterface: FileSystemInterface;
}

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

class FileChooserPanel extends React.Component<IPanelProps & FileChooserPanelProps> {
    render() {
        return (
            <ChooserContents>
                <ChooserItem>
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
                </ChooserItem>
            </ChooserContents>
        );
    }
}

export function FileChooser(props: FileChooserProps) {
    const currentPath = useState("/");
    const currentItems = useState([] as Array<FSItem>);
    return (
        <Chooser initialPanel={{
            component: FileChooserPanel,
            title: "/"
        }} />
    );
}
