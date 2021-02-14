import * as React from "react";
import styled from "styled-components";
import { Button, Card, Classes, Dialog, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { useState as useHookState } from "@hookstate/core";
import { FileSystemInterface } from "@buttercup/file-interface";
import { SHOW_ADD_VAULT } from "../state/addVault";
import { setBusy } from "../state/app";
import { authDropbox } from "../actions/dropbox";
import { testWebDAV } from "../actions/webdav";
import { getFSInstance } from "../library/fsInterface";
import { FileChooser } from "./standalone/FileChooser";
import { addNewVaultTarget, getFileVaultParameters } from "../actions/addVault";
import { showError } from "../services/notifications";
import { DatasourceConfig, SourceType } from "../types";

interface WebDAVCredentialsState {
    url: string;
    username: string;
    password: string;
}

const ICON_BUTTERCUP = require("../../../resources/images/buttercup-file-256.png").default;
const ICON_DROPBOX = require("../../../resources/images/dropbox-256.png").default;
const ICON_GOOGLEDRIVE = require("../../../resources/images/googledrive-256.png").default;
const ICON_WEBDAV = require("../../../resources/images/webdav-256.png").default;

const { useCallback, useEffect, useState } = React;

const EMPTY_DATASOURCE_CONFIG = { type: null };
const EMPTY_WEBDAV_CREDENTIALS: WebDAVCredentialsState = { url: "", username: "", password: "" };
const PAGE_TYPE = "type";
const PAGE_AUTH = "auth";
const PAGE_CHOOSE = "choose";
const PAGE_CONFIRM = "confirm";

const VAULT_TYPES = [
    {
        title: "File",
        type: SourceType.File,
        icon: ICON_BUTTERCUP
    },
    {
        title: "Dropbox",
        type: SourceType.Dropbox,
        icon: ICON_DROPBOX
    },
    {
        title: "Google Drive",
        type: SourceType.GoogleDrive,
        icon: ICON_GOOGLEDRIVE
    },
    {
        title: "WebDAV",
        type: SourceType.WebDAV,
        icon: ICON_WEBDAV
    }
];

const DialogFreeWidth = styled(Dialog)`
    width: auto !important;
`;
const LoadingContainer = styled.div`
    width: 460px;
    height: 300px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const TypeIcons = styled.div`
    margin: 18px 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;
const TypeIcon = styled(Card)`
    flex: 0 0 auto;
    width: 110px;
    margin: 8px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const TypeIconImage = styled.img`
    width: 80%;
    height: auto;
`;
const TypeText = styled.div`
    margin-top: 3px;
    width: 100%;
    text-align: center;
    color: grey;
`;
const WideFormGroup = styled(FormGroup)`
    input {
        width: 350px !important;
    }
    label {
        width: 130px !important;
    }
`;

export function AddVaultMenu() {
    const showAddVault = useHookState(SHOW_ADD_VAULT);
    const [previousShowAddVault, setPreviousShowAddVault] = useState(false);
    const [currentPage, setCurrentPage] = useState(PAGE_TYPE);
    const [selectedType, setSelectedType] = useState<SourceType>(null);
    const [selectedRemotePath, setSelectedRemotePath] = useState<string>(null);
    const [datasourcePayload, setDatasourcePayload] = useState<DatasourceConfig>({ ...EMPTY_DATASOURCE_CONFIG });
    const [fsInstance, setFsInstance] = useState<FileSystemInterface>(null);
    const [createNew, setCreateNew] = useState(false);
    const [vaultPassword, setVaultPassword] = useState("");
    const [webdavCredentials, setWebDAVCredentials] = useState<WebDAVCredentialsState>({ ...EMPTY_WEBDAV_CREDENTIALS });
    useEffect(() => {
        const newValue = showAddVault.get();
        if (previousShowAddVault !== newValue) {
            setPreviousShowAddVault(showAddVault.get());
            if (newValue) {
                setCurrentPage(PAGE_TYPE);
            }
        }
    }, [showAddVault.get(), previousShowAddVault]);
    const close = useCallback(() => {
        showAddVault.set(false);
        setFsInstance(null);
        setCurrentPage(PAGE_TYPE);
        setDatasourcePayload({ ...EMPTY_DATASOURCE_CONFIG });
        setWebDAVCredentials({ ...EMPTY_WEBDAV_CREDENTIALS });
        setVaultPassword("");
    }, []);
    const handleVaultTypeClick = useCallback(async type => {
        setSelectedType(type);
        if (type === SourceType.File) {
            setCurrentPage(PAGE_AUTH);
            const { filename, createNew } = await getFileVaultParameters();
            if (!filename) {
                close();
                return;
            }
            setDatasourcePayload({
                ...datasourcePayload,
                type,
                path: filename
            });
            setCreateNew(createNew);
            setCurrentPage(PAGE_CONFIRM);
        } else if (type === SourceType.Dropbox) {
            setBusy(true);
            setCurrentPage(PAGE_AUTH);
            const token = await authDropbox();
            setBusy(false);
            if (!token) {
                close();
                return;
            }
            setDatasourcePayload({
                ...datasourcePayload,
                type,
                token
            });
            setFsInstance(getFSInstance(type, { token }));
            setCurrentPage(PAGE_CHOOSE);
        } else if (type === SourceType.WebDAV) {
            setDatasourcePayload({
                ...datasourcePayload,
                type
            });
            setCurrentPage(PAGE_AUTH);
        }
    }, [datasourcePayload]);
    const handleAuthSubmit = useCallback(async () => {
        if (selectedType === SourceType.WebDAV) {
            setBusy(true);
            try {
                await testWebDAV(webdavCredentials.url, webdavCredentials.username, webdavCredentials.password);
            } catch (err) {
                showError(err.message);
                setBusy(false);
                return;
            }
            setBusy(false);
            const newPayload = {
                endpoint: webdavCredentials.url
            };
            if (webdavCredentials.username && webdavCredentials.password) {
                Object.assign(newPayload, {
                    username: webdavCredentials.username,
                    password: webdavCredentials.password
                });
            }
            setDatasourcePayload({
                ...datasourcePayload,
                ...newPayload
            });
            setFsInstance(getFSInstance(SourceType.WebDAV, newPayload));
            setCurrentPage(PAGE_CHOOSE);
        }
    }, [selectedType, datasourcePayload, webdavCredentials]);
    const handleSelectedPathChange = useCallback((selectedPath: string, isNew: boolean) => {
        setSelectedRemotePath(selectedPath);
        setCreateNew(isNew);
    }, []);
    const handleVaultFileSelect = useCallback(() => {
        if (selectedType === SourceType.Dropbox) {
            setDatasourcePayload({
                ...datasourcePayload,
                path: selectedRemotePath
            });
            setCurrentPage(PAGE_CONFIRM);
        } else if (selectedType ===  SourceType.WebDAV) {
            setDatasourcePayload({
                ...datasourcePayload,
                path: selectedRemotePath
            });
            setCurrentPage(PAGE_CONFIRM);
        }
    }, [selectedRemotePath, selectedType, datasourcePayload]);
    const handleFinalConfirm = useCallback(() => {
        addNewVaultTarget(datasourcePayload, vaultPassword, createNew);
        close(); // This also clears sensitive state items
    }, [datasourcePayload, vaultPassword]);
    // Pages
    const pageType = () => (
        <>
            <p>Choose a vault type to add:</p>
            <TypeIcons>
                {VAULT_TYPES.map(vaultType => (
                    <TypeIcon key={vaultType.type} interactive elevation={Elevation.TWO} onClick={() => handleVaultTypeClick(vaultType.type)}>
                        <TypeIconImage src={vaultType.icon} />
                        <TypeText>{vaultType.title}</TypeText>
                    </TypeIcon>
                ))}
            </TypeIcons>
        </>
    );
    const pageAuth = () => (
        <>
            {selectedType === SourceType.File && (
                <LoadingContainer>
                    <i>A dialog will open for choosing a vault file</i>
                </LoadingContainer>
            )}
            {selectedType === SourceType.Dropbox && (
                <LoadingContainer>
                    <i>A separate window will open for authentication</i>
                </LoadingContainer>
            )}
            {selectedType === SourceType.WebDAV && (
                <>
                    <WideFormGroup
                        inline
                        label="WebDAV Service"
                    >
                        <InputGroup
                            placeholder="https://..."
                            onChange={evt => setWebDAVCredentials({
                                ...webdavCredentials,
                                url: evt.target.value
                            })}
                            value={webdavCredentials.url}
                            autoFocus
                        />
                    </WideFormGroup>
                    <WideFormGroup
                        inline
                        label="Username"
                    >
                        <InputGroup
                            placeholder="WebDAV Username"
                            onChange={evt => setWebDAVCredentials({
                                ...webdavCredentials,
                                username: evt.target.value
                            })}
                            value={webdavCredentials.username}
                        />
                    </WideFormGroup>
                    <WideFormGroup
                        inline
                        label="Password"
                    >
                        <InputGroup
                            placeholder="WebDAV Password"
                            onChange={evt => setWebDAVCredentials({
                                ...webdavCredentials,
                                password: evt.target.value
                            })}
                            type="password"
                            value={webdavCredentials.password}
                        />
                    </WideFormGroup>
                </>
            )}
        </>
    );
    const pageChoose = () => (
        <>
            <p>Choose a vault file or create a new vault:</p>
            <FileChooser callback={handleSelectedPathChange} fsInterface={fsInstance} />
        </>
    );
    const pageConfirm = () => (
        <>
            {createNew && (
                <p>Enter a new primary vault password:</p>
            )}
            {!createNew && (
                <p>Enter the primary vault password:</p>
            )}
            <InputGroup
                id="password"
                placeholder="Vault password..."
                type="password"
                value={vaultPassword}
                onChange={evt => setVaultPassword(evt.target.value)}
                autoFocus
            />
        </>
    );
    // Output
    return (
        <DialogFreeWidth isOpen={showAddVault.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Add Vault</div>
            <div className={Classes.DIALOG_BODY}>
                {currentPage === PAGE_TYPE && pageType()}
                {currentPage === PAGE_AUTH && pageAuth()}
                {currentPage === PAGE_CHOOSE && pageChoose()}
                {currentPage === PAGE_CONFIRM && pageConfirm()}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {currentPage === PAGE_CHOOSE && (
                        <Button
                            disabled={!selectedRemotePath}
                            intent={Intent.PRIMARY}
                            onClick={handleVaultFileSelect}
                            title="Continue adding vault"
                        >
                            Next
                        </Button>
                    )}
                    {currentPage === PAGE_AUTH && selectedType === SourceType.WebDAV && (
                        <Button
                            disabled={!webdavCredentials.url}
                            intent={Intent.PRIMARY}
                            onClick={handleAuthSubmit}
                            title="Connect using WebDAV"
                        >
                            Next
                        </Button>
                    )}
                    {currentPage === PAGE_CONFIRM && (
                        <Button
                            disabled={vaultPassword.length === 0}
                            intent={Intent.PRIMARY}
                            onClick={handleFinalConfirm}
                            title="Confirm vault addition"
                        >
                            Add Vault
                        </Button>
                    )}
                    <Button
                        onClick={close}
                        title="Cancel Unlock"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </DialogFreeWidth>
    );
}
