import * as React from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Alignment, Button, ButtonGroup, Card, Classes, Dialog, Elevation, FormGroup, InputGroup, Intent, MenuItem, Switch } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { naiveClone } from "../../shared/library/clone";
import { SHOW_PREFERENCES, showPreferences as setShowPreferences } from "../state/preferences";
import { getPreferences } from "../services/preferences";
import { getAvailableLanguages } from "../services/i18n";
import { logErr } from "../library/log";
import { showError } from "../services/notifications";
import { PREFERENCES_DEFAULT } from "../../shared/symbols";
import { Language, Preferences } from "../types";

const { useCallback, useEffect, useState } = React;
const LanguageSelect = Select.ofType<Language>();

const DialogFreeWidth = styled(Dialog)`
    width: 85%;
    max-width: 800px;
    min-width: 600px;
`;
const PreferencesContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;
const PreferencesMenu = styled(ButtonGroup)`
    width: 100%;
`;
const PreferencesSidebar = styled.div`
    width: 140px;
    flex: 0 0 auto;
    margin-right: 6px;
`;

export function PreferencesDialog() {
    const showPreferences = useHookState(SHOW_PREFERENCES);
    const [preferences, setPreferences] = useState<Preferences>(naiveClone(PREFERENCES_DEFAULT));
    const [languages, setLanguages] = useState<Array<Language>>([]);
    const close = useCallback(() => {
        setShowPreferences(false);
    }, []);
    useEffect(() => {
        getPreferences()
            .then(prefs => {
                setPreferences(naiveClone(prefs));
            })
            .catch(err => {
                showError("Failed loading preferences");
                logErr("Failed loading preferences", err);
                setShowPreferences(false);
            });
        getAvailableLanguages()
            .then(langs => {
                setLanguages([
                    {
                        name: "Auto (OS default)",
                        slug: null
                    },
                    ...langs
                ]);
            })
            .catch(err => {
                showError("Failed loading languages");
                logErr("Failed loading languages", err);
                setShowPreferences(false);
            });
    }, [showPreferences.get()]);
    // Pages
    const pageGeneral = () => (
        <>
            <FormGroup label="Language">
                <LanguageSelect
                    filterable={false}
                    items={languages}
                    itemRenderer={(item: Language) => (
                        <MenuItem
                            icon="add"
                            text={item.name}
                        />
                    )}
                    onItemSelect={(item: Language) => {
                        setPreferences({
                            ...naiveClone(preferences),
                            language: item.slug
                        });
                    }}
                >
                    <Button text={languages.length > 0 ? languages[0].name : "(Loading)"} rightIcon="double-caret-vertical" />
                </LanguageSelect>
            </FormGroup>
        </>
    );
    // Render
    return (
        <DialogFreeWidth isOpen={showPreferences.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Preferences</div>
            <div className={Classes.DIALOG_BODY}>
                {showPreferences.get() && (
                    <PreferencesContent>
                        <PreferencesSidebar>
                            <PreferencesMenu
                                alignText={Alignment.LEFT}
                                vertical
                            >
                                <Button
                                    icon="modal"
                                    text="General"
                                />
                                <Button
                                    icon="shield"
                                    text="Security"
                                />
                                <Button
                                    disabled
                                    icon="eye-off"
                                    text="Privacy"
                                />
                                <Button
                                    disabled
                                    icon="lab-test"
                                    text="Debug"
                                />
                            </PreferencesMenu>
                        </PreferencesSidebar>
                    </PreferencesContent>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {/* <Button
                        disabled={vaultPassword.length === 0}
                        intent={Intent.PRIMARY}
                        onClick={handleFinalConfirm}
                        title="Confirm vault addition"
                    >
                        Add Vault
                    </Button> */}
                    <Button
                        onClick={close}
                        title="Cancel Preferences update"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </DialogFreeWidth>
    );
}
