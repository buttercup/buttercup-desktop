import * as React from "react";
import styled from "styled-components";
import { Button, Card, Classes, Dialog, Elevation } from "@blueprintjs/core";
import { useState } from "@hookstate/core";
import { SHOW_ADD_VAULT } from "../state/addVault";

const ICON_BUTTERCUP = require("../../../resources/images/buttercup-file-256.png").default;
const ICON_DROPBOX = require("../../../resources/images/dropbox-256.png").default;
const ICON_GOOGLEDRIVE = require("../../../resources/images/googledrive-256.png").default;
const ICON_WEBDAV = require("../../../resources/images/webdav-256.png").default;

const { useCallback, useEffect } = React;

const PAGE_TYPE = "type";
const PAGE_AUTH = "auth";
const PAGE_CHOOSE = "choose";
const PAGE_CONFIRM = "confirm";

const VAULT_TYPES = [
    {
        title: "File",
        type: "file",
        icon: ICON_BUTTERCUP
    },
    {
        title: "Dropbox",
        type: "dropbox",
        icon: ICON_DROPBOX
    },
    {
        title: "Google Drive",
        type: "googledrive",
        icon: ICON_GOOGLEDRIVE
    },
    {
        title: "WebDAV",
        type: "webdav",
        icon: ICON_WEBDAV
    }
];

const DialogFreeWidth = styled(Dialog)`
    width: auto !important;
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

export function AddVaultMenu() {
    const showAddVaultState = useState(SHOW_ADD_VAULT);
    const previousShowAddVault = useState(false);
    const currentPage = useState(PAGE_TYPE);
    useEffect(() => {
        const newValue = showAddVaultState.get();
        if (previousShowAddVault.get() !== newValue) {
            previousShowAddVault.set(showAddVaultState.get());
            if (newValue) {
                currentPage.set(PAGE_TYPE);
            }
        }
    }, [showAddVaultState.get()]);
    const close = useCallback(() => {
        showAddVaultState.set(false);
    }, []);
    // Pages
    const pageType = () => (
        <>
            <p>Choose a vault type to add:</p>
            <TypeIcons>
                {VAULT_TYPES.map(vaultType => (
                    <TypeIcon key={vaultType.type} interactive elevation={Elevation.TWO}>
                        <TypeIconImage src={vaultType.icon} />
                        <TypeText>{vaultType.title}</TypeText>
                    </TypeIcon>
                ))}
            </TypeIcons>
        </>
    );
    // Output
    return (
        <DialogFreeWidth isOpen={showAddVaultState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Add Vault</div>
            <div className={Classes.DIALOG_BODY}>
                {currentPage.get() === PAGE_TYPE && pageType()}
                {/* <FormGroup
                    label="Vault Password"
                    labelFor="password"
                    labelInfo="(required)"
                >
                    <InputGroup
                        id="password"
                        placeholder="Vault password..."
                        type="password"
                        value={currentPassword.get()}
                        onChange={evt => currentPassword.set(evt.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                </FormGroup> */}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {/* <Button
                        intent={Intent.PRIMARY}
                        onClick={() => submitAndClose(currentPassword.get())}
                        title="Confirm vault unlock"
                    >
                        Unlock
                    </Button> */}
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
