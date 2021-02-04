import * as React from "react";
import styled from "styled-components";
import { Icon } from "@blueprintjs/core";
import { FileSystemInterface } from "@buttercup/file-interface";
import { useState } from "@hookstate/core";
import { FSItem } from "../../library/fsInterface";

interface FileChooserProps {
    callback: (path: string | null) => void;
    fsInterface: FileSystemInterface;
}

const FOLDER_COLOUR = "#F7D774";
const ICON_SIZE = 34;

const Chooser = styled.div`
    width: 100%;
    min-width: 450px;
    height: 100%;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-items: space-between;
    align-items: stretch;
`;
const ChooserTitle = styled.div`
    height: 28px;
    flex: 0 0 auto;
    text-align: center;
    font-weight: bold;
    font-size: 110%;
    padding-top: 4px;
    padding-bottom: 2px;
    margin-bottom: 8px;
`;
const ChooserContents = styled.div`
    flex: 10 10 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
`;
const ChooserItem = styled.div`
    width: 75px;
    max-width: 75px;
    min-width: 75px;
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
    color: #333;
    font-weight: 550;
    font-size: 80%;
    overflow-wrap: break-word;
    width: 80%;
    margin-top: 4px;
    user-select: none;
`;

export function FileChooser(props: FileChooserProps) {
    const currentPath = useState("/");
    const currentItems = useState([] as Array<FSItem>);
    return (
        <Chooser>
            <ChooserTitle>{currentPath.get()}</ChooserTitle>
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
        </Chooser>
    );
}
