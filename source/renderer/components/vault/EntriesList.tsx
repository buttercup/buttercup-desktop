import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";
import { NonIdealState } from "@blueprintjs/core";
import { Entry } from "./Entry";
import { useCurrentEntries, useGroups } from "./hooks/vault";
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from "./Pane";
import AddEntry from "./AddEntry";
import { VaultContext } from "./VaultContext";
import { t } from "../../../shared/i18n/trans";
import { copyToClipboard } from "../../library/clipboard";

interface EntriesListProps {
    className?: string;
}

export const EntriesList = ({ className }: EntriesListProps) => {
    const {
        entries,
        selectedEntryID,
        onSelectEntry,
        filters,
        onEntriesFilterTermChange,
        onEntriesFilterSortModeChange
    } = useCurrentEntries();
    const { readOnly } = useContext(VaultContext);
    const { selectedGroupID, trashSelected } = useGroups();
    const ref = useRef<HTMLInputElement | null>(null);
    const currentIndex = entries.findIndex(entry => entry.id === selectedEntryID);
    const keyMap = {
        arrowUp: "up",
        arrowDown: "down",
        enter: "enter",
        copyUsername: ["ctrl+b", "command+b"],
        copyPassword: ["ctrl+c", "command+c"]
    };
    const handleNavigation = (event, step) => {
        event.preventDefault();
        const nextEntryID =
            step < 0
                ? entries[currentIndex === 0 ? entries.length - 1 : currentIndex - 1]
                : entries[(currentIndex + 1) % entries.length];
        onSelectEntry(nextEntryID.id);
        if (ref.current) {
            ref.current.focus();
        }
    };
    const handleCopyField = entryToCopy => {
        if (!entryToCopy) return;
        return copyToClipboard(entryToCopy.value);
    };
    const handlers = {
        arrowUp: event => handleNavigation(event, -1),
        arrowDown: event => handleNavigation(event, 1),
        enter: () => {
            if (document.activeElement !== ref.current) {
                (document.activeElement as HTMLElement).click();
            }
        },
        copyUsername: e => {
            e.preventDefault();
            handleCopyField(entries[currentIndex].fields.find(field => field.title === "Username"));
        },
        copyPassword: e => {
            e.preventDefault();
            handleCopyField(entries[currentIndex].fields.find(field => field.title === "Password"));
        }
    };

    return (
        <PaneContainer className={className}>
            <PaneHeader
                title={trashSelected ? t("vault-ui.entries-list.trash") : t("vault-ui.entries-list.documents")}
                count={entries.length}
                filter={filters}
                onTermChange={term => onEntriesFilterTermChange(term)}
                onSortModeChange={sortMode => onEntriesFilterSortModeChange(sortMode)}
            />
            <PaneContent>
                {entries.length > 0 && (
                    <HotKeys keyMap={keyMap} handlers={handlers} tabIndex={1}>
                        {entries.map((entry, entryIndex) => (
                            <Entry
                                tabIndex={entryIndex + 2}
                                entry={entry}
                                key={entry.id}
                                onClick={e => onSelectEntry(entry.id)}
                                selected={selectedEntryID === entry.id}
                                innerRef={el => {
                                    if (selectedEntryID === entry.id) {
                                        ref.current = el;
                                    }
                                }}
                            />
                        ))}
                    </HotKeys>
                )}
                {entries.length === 0 && filters.term !== "" && (
                    <NonIdealState title={t("vault-ui.entries-list.filters-no-matches")} />
                )}
                {entries.length === 0 && trashSelected && (
                    <NonIdealState title={t("vault-ui.entries-list.trash-empty")} icon="trash" />
                )}
                {entries.length === 0 && !filters.term && !trashSelected && (
                    <NonIdealState
                        title={t("vault-ui.entries-list.no-entries")}
                        description={t("vault-ui.entries-list.create-one-cta")}
                        icon="id-number"
                    />
                )}
            </PaneContent>
            <PaneFooter>
                <AddEntry disabled={trashSelected || readOnly || !selectedGroupID} />
            </PaneFooter>
        </PaneContainer>
    );
};
