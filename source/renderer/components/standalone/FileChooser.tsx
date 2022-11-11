import * as React from "react";
import styled from "styled-components";
import { Alignment, Breadcrumb, Breadcrumbs, Button, Card, Classes, Dialog, IBreadcrumbProps, Icon, InputGroup, Intent, Navbar, Spinner } from "@blueprintjs/core";
import { FileIdentifier, FileItem, FileSystemInterface, PathIdentifier } from "@buttercup/file-interface";
import { t } from "../../../shared/i18n/trans";
import { NewVaultPlaceholder } from "../../types";

/*
    File Manager for connecting vaults
        Inspired by this codepen: https://codepen.io/suryansh54/pen/QQqjxv
*/

const ICON_BUTTERCUP = require("../../../../resources/images/buttercup-256.png").default;

const { useCallback, useEffect, useState } = React;

interface BreadcrumbProps {
    text: string;
    identifier: Identifier;
}

type Identifier = FileChooserPath | null;

interface FileChooserPath {
    identifier: string | number;
    name: string;
}

interface FileChooserProps {
    callback: (
        parentIdentifier: string | number | null,
        identifier: string | number | null,
        isNew: boolean,
        fileName: string | null
    ) => void;
    fsInterface: FileSystemInterface;
}

const FILE_COLOUR = "#222";
const FOLDER_COLOUR = "#F7D774";
const ICON_SIZE = 34;
const ITEM_WIDTH = 75;

const CHOOSER_MAX_WIDTH = ITEM_WIDTH * 8 + 10;
const CHOOSER_MIN_WIDTH = ITEM_WIDTH * 6 + 10;

const Chooser = styled.div`
    width: 100%;
    min-width: ${CHOOSER_MIN_WIDTH}px;
    max-width: ${CHOOSER_MAX_WIDTH}px;
    height: 100%;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-items: space-between;
    align-items: stretch;
`;
const ChooserContents = styled(Card)`
    margin-top: 6px;
    flex: 10 10 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 4px;
    max-height: 60vh;
    overflow-y: scroll;
`;
const ChooserItem = styled.div<{ selected?: boolean }>`
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
    background-color: ${props => props.selected ? "rgba(255, 201, 64, 0.3)" : "transparent"};

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
const IconImg = styled.img`
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
`;
const IconInline = styled(Icon)`
    display: inline-block;
`;

export function FileChooser(props: FileChooserProps) {
    const [currentItems, setCurrentItems] = useState<Array<FileItem>>([]);
    const [currentPath, setCurrentPath] = useState<Identifier>(null);
    const [loading, setLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbProps>>([]);
    const [showNewVaultFilenamePrompt, setShowNewVaultFilenamePrompt] = useState(false);
    const [newVaultFilename, setNewVaultFilename] = useState(null);
    const [newVault, setNewVault] = useState<NewVaultPlaceholder>(null);
    const [selectedVaultPath, setSelectedVaultPath] = useState<FileIdentifier>(null);
    const loadPath = useCallback(async (identifier: Identifier) => {
        setLoading(true);
        const results = await props.fsInterface.getDirectoryContents(identifier as PathIdentifier);
        setCurrentItems(results);
        setLoading(false);
    }, []);
    const handleItemClick = useCallback((item: FileItem) => {
        if (item.type === "file") {
            if (/\.bcup$/i.test(item.name) === true) {
                setSelectedVaultPath(item);
            }
        } else {
            setBreadcrumbs([
                ...breadcrumbs,
                {
                    text: currentPath === null ? "/" : item.name,
                    identifier: currentPath
                }
            ]);
            loadPath({ identifier: item.identifier, name: item.name });
            setCurrentPath({ identifier: item.identifier, name: item.name });
            setSelectedVaultPath(null);
            setNewVault(null);
        }
    }, [breadcrumbs, currentPath]);
    const handlePreviousPathClick = useCallback((event, index: number) => {
        event.preventDefault();
        const bc = breadcrumbs[index];
        setBreadcrumbs(breadcrumbs.slice(0, index));
        loadPath(bc.identifier);
        setCurrentPath(bc.identifier);
        setSelectedVaultPath(null);
        setNewVault(null);
    }, [breadcrumbs, newVault, selectedVaultPath]);
    const handleNewVaultPromptClose = useCallback(() => {
        setShowNewVaultFilenamePrompt(false);
        setNewVaultFilename(null);
    }, []);
    const handleNewVaultPromptSubmit = useCallback(() => {
        setShowNewVaultFilenamePrompt(false);
        const targetNewFileName = /\.bcup$/i.test(newVaultFilename) ? newVaultFilename : `${newVaultFilename}.bcup`;
        if (currentItems.find(ci => ci.name === targetNewFileName)) {
            setNewVaultFilename(null);
            setNewVault(null);
            setSelectedVaultPath(null);
            return;
        }
        setNewVault({
            filename: targetNewFileName,
            parentIdentifier: currentPath ? currentPath.identifier : null
        });
        setSelectedVaultPath({
            identifier: targetNewFileName,
            name: targetNewFileName
        });
        setNewVaultFilename(null);
    }, [newVaultFilename, currentPath, currentItems]);
    const showNewVaultPrompt = useCallback(() => {
        setNewVaultFilename(currentPath);
        setNewVaultFilename("");
        setShowNewVaultFilenamePrompt(true);
    }, [currentPath]);
    const renderBreadcrumb = useCallback(({ text, ...restProps }: IBreadcrumbProps) => (
            <Breadcrumb {...restProps}>
                {text}
            </Breadcrumb>
        ),
        []
    );
    useEffect(() => {
        loadPath(null);
    }, []);
    useEffect(() => {
        props.callback(
            newVault ? newVault.parentIdentifier : null,
            selectedVaultPath ? selectedVaultPath.identifier : null,
            !!newVault,
            selectedVaultPath ? selectedVaultPath.name : null
        );
    }, [selectedVaultPath, props.callback, newVault]);
    return (
        <Chooser>
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Button className="bp3-minimal" icon="new-object" text={t("dialog.file-chooser.nav.create-new")} onClick={showNewVaultPrompt} />
                    {newVault && (
                        <Button className="bp3-minimal" icon="graph-remove" text={t("dialog.file-chooser.nav.cancel-new")} onClick={() => {
                            if (newVault.filename === selectedVaultPath.name) {
                                setSelectedVaultPath(null);
                            }
                            setNewVault(null);
                        }} />
                    )}
                    <Navbar.Divider />
                    <Breadcrumbs
                        currentBreadcrumbRenderer={renderBreadcrumb as any}
                        items={[
                            ...breadcrumbs.map((bc, ind) => ({
                                text: bc.text,
                                onClick: evt => handlePreviousPathClick(evt, ind)
                            })),
                            {
                                text: currentPath === null ? "/" : currentPath.name
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
                    <ChooserItem
                        key={item.identifier}
                        onClick={() => handleItemClick(item)}
                        selected={selectedVaultPath && item.identifier === selectedVaultPath.identifier}
                    >
                        <Icon
                            icon={
                                item.type === "directory"
                                    ? "folder-close"
                                    : /\.bcup$/i.test(item.name)
                                        ? <IconImg src={ICON_BUTTERCUP} />
                                        : "document"
                            }
                            iconSize={ICON_SIZE}
                            color={item.type === "directory" ? FOLDER_COLOUR : FILE_COLOUR}
                        />
                        <ChooserItemText>{item.name}</ChooserItemText>
                    </ChooserItem>
                ))}
                {newVault && (
                    <ChooserItem
                        onClick={() => setSelectedVaultPath({
                            identifier: newVault.filename,
                            name: newVault.filename
                        })}
                        selected={newVault.filename === selectedVaultPath.name}
                    >
                        <Icon
                            icon={<IconImg src={ICON_BUTTERCUP} />}
                            iconSize={ICON_SIZE}
                        />
                        <ChooserItemText><IconInline icon="plus" iconSize={10} color="#ff7373" /> {newVault.filename}</ChooserItemText>
                    </ChooserItem>
                )}
            </ChooserContents>
            <Dialog isOpen={showNewVaultFilenamePrompt} onClose={handleNewVaultPromptClose}>
                <div className={Classes.DIALOG_HEADER}>{t("dialog.file-chooser.add.title")}</div>
                <div className={Classes.DIALOG_BODY}>
                    <p>{t("dialog.file-chooser.add.description")}</p>
                    <InputGroup
                        onChange={evt => setNewVaultFilename(evt.target.value)}
                        placeholder="new-vault.bcup"
                        value={newVaultFilename || ""}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            disabled={!/[^\.]+/.test(newVaultFilename) || /[\/\\]/.test(newVaultFilename)}
                            intent={Intent.PRIMARY}
                            onClick={handleNewVaultPromptSubmit}
                            title={t("dialog.file-chooser.add.confirm-title")}
                        >
                            {t("dialog.file-chooser.add.confirm")}
                        </Button>
                        <Button
                            onClick={handleNewVaultPromptClose}
                            title={t("dialog.file-chooser.add.cancel-title")}
                        >
                            {t("dialog.file-chooser.add.cancel")}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Chooser>
    );
}
