import * as React from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { Alignment, Button, ButtonGroup, Callout, Classes, Dialog, FormGroup, Intent, MenuItem, Radio, RadioGroup, Slider, Switch } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import ms from "ms";
import prettyMS from "pretty-ms";
import { naiveClone } from "../../shared/library/clone";
import { SHOW_PREFERENCES, showPreferences as setShowPreferences } from "../state/preferences";
import { getPreferences, savePreferences } from "../services/preferences";
import { getAvailableLanguages } from "../services/i18n";
import { logErr, logInfo } from "../library/log";
import { showError, showSuccess } from "../services/notifications";
import { setBusy } from "../state/app";
import { t } from "../../shared/i18n/trans";
import { PREFERENCES_DEFAULT } from "../../shared/symbols";
import { AppStartMode, Language, Preferences, ThemeSource } from "../types";

const { useCallback, useEffect, useMemo, useState } = React;
const LanguageSelect = Select.ofType<Language>();
const ThemeSelect = Select.ofType<ThemeSource>();

const AUTO_CLEAR_CP_MAX = ms("30m") / 1000;
const LANG_AUTO_NAME = "Auto (OS)";
const LOCK_VAULTS_TIME_MAX = ms("1d") / 1000;
const PAGE_CONNECTIVITY = "connectivity";
const PAGE_GENERAL = "general";
const PAGE_SECURITY = "security";
const PAGE_UPDATES = "updates";
const THEME_AUTO_NAME = "Auto (OS)";

const DialogFreeWidth = styled(Dialog)`
    width: 85%;
    max-width: 800px;
    min-width: 600px;
    height: 100%;
    min-height: 400px;
    max-height: 700px;
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
const PageContent = styled.div`
    flex: 1 1 auto;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 16px;
`;

export function PreferencesDialog() {
    const showPreferences = useHookState(SHOW_PREFERENCES);
    const [currentPage, setCurrentPage] = useState(PAGE_GENERAL);
    const [dirty, setDirty] = useState(false);
    const [preferences, _setPreferences] = useState<Preferences>(naiveClone(PREFERENCES_DEFAULT));
    const [languages, setLanguages] = useState<Array<Language>>([]);
    const setPreferences = useCallback((prefs: Preferences) => {
        _setPreferences(prefs);
        setDirty(true);
    }, [_setPreferences]);
    const selectedLanguageName = useMemo(() => {
        if (languages.length === 0 || !preferences.language) return LANG_AUTO_NAME;
        const lang = languages.find(lang => lang.slug === preferences.language);
        return lang && lang.name || LANG_AUTO_NAME;
    }, [preferences, languages]);
    const close = useCallback(() => {
        setShowPreferences(false);
        setCurrentPage(PAGE_GENERAL);
    }, []);
    const save = useCallback(() => {
        setBusy(true);
        savePreferences(preferences)
            .then(() => {
                showSuccess(t("notification.preferences-saved"));
                logInfo("Saved preferences");
                setDirty(false);
                setBusy(false);
                close();
            })
            .catch(err => {
                setBusy(false);
                showError(t("notification.error.preferences-save"));
                logErr("Failed saving preferences", err);
            });
    }, [preferences]);
    useEffect(() => {
        getPreferences()
            .then(prefs => {
                _setPreferences(naiveClone(prefs));
                setDirty(false);
            })
            .catch(err => {
                showError(t("notification.error.preferences-load"));
                logErr("Failed loading preferences", err);
                setShowPreferences(false);
            });
        getAvailableLanguages()
            .then(langs => {
                setLanguages([
                    {
                        name: LANG_AUTO_NAME,
                        slug: null
                    },
                    ...langs
                ]);
            })
            .catch(err => {
                showError(t("notification.error.languages-load"));
                logErr("Failed loading languages", err);
                setShowPreferences(false);
            });
    }, [showPreferences.get()]);
    // Pages
    const pageGeneral = () => (
        <>
            <FormGroup label={t("preferences.item.language")}>
                <LanguageSelect
                    filterable={false}
                    items={languages}
                    itemRenderer={(item: Language, { handleClick }) => (
                        <MenuItem
                            icon={item.slug === null ? "translate" : null}
                            key={item.name}
                            onClick={handleClick}
                            text={item.name}
                        />
                    )}
                    onItemSelect={(item: Language) => setPreferences({
                        ...naiveClone(preferences),
                        language: item.slug
                    })}
                >
                    <Button
                        text={selectedLanguageName}
                        rightIcon="double-caret-vertical"
                    />
                </LanguageSelect>
            </FormGroup>
            <FormGroup label={t("preferences.item.theme")}>
                <ThemeSelect
                    filterable={false}
                    items={Object.values(ThemeSource)}
                    itemRenderer={(item: ThemeSource, { handleClick }) => (
                        <MenuItem
                            icon={item === ThemeSource.System ? "modal-filled" : null}
                            key={item || "none"}
                            onClick={handleClick}
                            text={item === ThemeSource.System ? THEME_AUTO_NAME : item === ThemeSource.Dark ? t("theme.dark") : t("theme.light")}
                        />
                    )}
                    onItemSelect={(item: ThemeSource) => setPreferences({
                        ...naiveClone(preferences),
                        uiTheme: item
                    })}
                >
                    <Button
                        text={preferences.uiTheme === ThemeSource.System ? THEME_AUTO_NAME : preferences.uiTheme === ThemeSource.Dark ? t("theme.dark") : t("theme.light")}
                        rightIcon="double-caret-vertical"
                    />
                </ThemeSelect>
            </FormGroup>
            <FormGroup label={t("preferences.item.startup-options.title")}>
                <Switch
                    checked={preferences.startWithSession}
                    label={t("preferences.item.startup-options.start-with-session")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        startWithSession: evt.target.checked,
                    })}
                />
                <RadioGroup
                    label={t("preferences.item.startup-options.background.title")}
                    onChange={(evt: React.FormEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        startMode: evt.currentTarget.value as AppStartMode
                    })}
                    selectedValue={preferences.startMode}
                >
                    <Radio label={t("preferences.item.startup-options.background.mode-none")} value={AppStartMode.None} />
                    <Radio label={t("preferences.item.startup-options.background.mode-hidden-boot")} value={AppStartMode.HiddenOnBoot} />
                    <Radio label={t("preferences.item.startup-options.background.mode-hidden-always")} value={AppStartMode.HiddenAlways} />
                </RadioGroup>
            </FormGroup>
        </>
    );
    const pageSecurity = () => (
        <>
            <FormGroup label={t("preferences.item.clear-clipboard")}>
                <Slider
                    labelRenderer={value => value > 0 ? prettyMS(value * 1000) : "Off"}
                    labelStepSize={60 * 5}
                    max={AUTO_CLEAR_CP_MAX}
                    min={0}
                    onChange={value => setPreferences({
                        ...naiveClone(preferences),
                        autoClearClipboard: value === 0 ? false : value
                    })}
                    stepSize={30}
                    value={preferences.autoClearClipboard === false ? 0 : preferences.autoClearClipboard}
                />
            </FormGroup>
            <FormGroup label={t("preferences.item.lock-vaults-after-time")}>
                <Slider
                    labelRenderer={value => value > 0 ? prettyMS(value * 1000) : "Off"}
                    labelStepSize={ms("1h") / 1000}
                    max={LOCK_VAULTS_TIME_MAX}
                    min={0}
                    onChange={value => setPreferences({
                        ...naiveClone(preferences),
                        lockVaultsAfterTime: value === 0 ? false : value
                    })}
                    stepSize={60}
                    value={preferences.lockVaultsAfterTime === false ? 0 : preferences.lockVaultsAfterTime}
                />
                <p>{t("preferences.item.lock-vaults-after-time-desc")}</p>
            </FormGroup>
            <FormGroup label={t("preferences.item.lock-vaults-window-closed")}>
                <Switch
                    checked={preferences.lockVaultsOnWindowClose}
                    label={t("preferences.item.lock-vaults-window-closed-label")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        lockVaultsOnWindowClose: evt.target.checked
                    })}
                />
            </FormGroup>
        </>
    );
    const pageConnectivity = () => (
        <>
            <FormGroup label={t("preferences.item.secure-file-host.title")}>
                <Callout icon="info-sign">
                    <div dangerouslySetInnerHTML={{ __html: t("preferences.item.secure-file-host.description") }} />
                </Callout>
                <Switch
                    checked={preferences.fileHostEnabled}
                    label={t("preferences.item.secure-file-host.label")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        fileHostEnabled: evt.target.checked
                    })}
                />
            </FormGroup>
        </>
    );
    const pageUpdates = () => (
        <>
            <FormGroup label={t("preferences.item.pre-release.title")}>
                <Callout icon="lab-test" intent={Intent.WARNING}>
                    <div dangerouslySetInnerHTML={{ __html: t("preferences.item.pre-release.description") }} />
                </Callout>
                <Switch
                    checked={preferences.prereleaseUpdates}
                    label={t("preferences.item.pre-release.label")}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setPreferences({
                        ...naiveClone(preferences),
                        prereleaseUpdates: evt.target.checked
                    })}
                />
            </FormGroup>
        </>
    );
    // Render
    return (
        <DialogFreeWidth isOpen={showPreferences.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>{t("preferences.title")}</div>
            <div className={Classes.DIALOG_BODY}>
                {showPreferences.get() && (
                    <PreferencesContent>
                        <PreferencesSidebar>
                            <PreferencesMenu
                                alignText={Alignment.LEFT}
                                vertical
                            >
                                <Button
                                    active={currentPage === PAGE_GENERAL}
                                    icon="modal"
                                    onClick={() => setCurrentPage(PAGE_GENERAL)}
                                    text={t("preferences.section.general")}
                                />
                                <Button
                                    active={currentPage === PAGE_SECURITY}
                                    icon="shield"
                                    onClick={() => setCurrentPage(PAGE_SECURITY)}
                                    text={t("preferences.section.security")}
                                />
                                <Button
                                    active={currentPage === PAGE_CONNECTIVITY}
                                    icon="offline"
                                    onClick={() => setCurrentPage(PAGE_CONNECTIVITY)}
                                    text={t("preferences.section.connectivity")}
                                />
                                <Button
                                    active={currentPage === PAGE_UPDATES}
                                    icon="updated"
                                    onClick={() => setCurrentPage(PAGE_UPDATES)}
                                    text={t("preferences.section.updates")}
                                />
                            </PreferencesMenu>
                        </PreferencesSidebar>
                        <PageContent>
                            {currentPage === PAGE_GENERAL && pageGeneral()}
                            {currentPage === PAGE_SECURITY && pageSecurity()}
                            {currentPage === PAGE_CONNECTIVITY && pageConnectivity()}
                            {currentPage === PAGE_UPDATES && pageUpdates()}
                        </PageContent>
                    </PreferencesContent>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        disabled={!dirty}
                        intent={Intent.PRIMARY}
                        onClick={() => save()}
                        title={t("preferences.button.save-title")}
                    >
                        {t("preferences.button.save")}
                    </Button>
                    <Button
                        onClick={close}
                        title={t("preferences.button.cancel-title")}
                    >
                        {t("preferences.button.cancel")}
                    </Button>
                </div>
            </div>
        </DialogFreeWidth>
    );
}
