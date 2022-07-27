import React, { useEffect, useMemo, useRef } from "react";
import { IInputGroupProps2, Intent, MenuItem, Tag } from "@blueprintjs/core";
import { Omnibar } from "@blueprintjs/select";
import { SiteIcon } from "@buttercup/ui";
import { EntryType } from "buttercup";
import styled from "styled-components";
import { extractSSHPubKeyName } from "../../library/entryType";
import { trimWithEllipses } from "../../library/trim";
import { t } from "../../../shared/i18n/trans";
import { SearchResult } from "../../types";

interface SearchModalProps {
    onClose: () => void;
    onSearch: (term: string) => void;
    onSelect: (result: SearchResult) => void;
    results: Array<SearchResult>;
    visible: boolean;
}

const SearchOmnibar = Omnibar.ofType<SearchResult>();

const ResultIcon = styled(SiteIcon)`
    width: 20px;
    height: 20px;
    img {
        height: 100%;
        width: auto;
    }
`;

function getDomain(res: SearchResult): string | null {
    if (res.type === "entry") {
        const [url] = res.result.urls;
        if (/^https?:\/\//i.test(url)) {
            const [domain] = url.replace(/^https?:\/\//i, "").split("/");
            return domain;
        }
    }
    return null;
}

function getResultLabel(res: SearchResult): string | React.ReactNode {
    const {
        result: {
            entryType,
            properties
        }
    } = res;
    switch (entryType) {
        case EntryType.Login:
            /* falls through */
        case EntryType.Website:
            return properties.username ? <Tag icon="user" minimal>{properties.username}</Tag> : ""
        case EntryType.CreditCard:
            return properties.username ? <Tag icon="credit-card" minimal>{properties.username}</Tag> : ""
        case EntryType.SSHKey:
            return properties.publicKey ? <Tag icon="id-number" minimal>{trimWithEllipses(extractSSHPubKeyName(properties.publicKey), 12)}</Tag> : ""
        default:
            return "";
    }
}

function renderResult(res: SearchResult, { handleClick, modifiers }) {
    if (!modifiers.matchesPredicate) return null;
    if (!res) return null;
    if (res.type === "entry") {
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                labelElement={getResultLabel(res)}
                key={res.result.id}
                onClick={handleClick}
                icon={<ResultIcon domain={getDomain(res)} />}
                text={res.result.properties.title}
            />
        );
    }
    return (
        <MenuItem disabled intent={Intent.DANGER} text={t("search.modal.result-render-error")} />
    );
}

export function SearchModal(props: SearchModalProps) {
    const {
        onClose,
        onSearch,
        onSelect,
        results,
        visible
    } = props;
    const searchInputRef = useRef<HTMLInputElement>();
    const searchInputProps = useMemo(() => ({
        inputRef: searchInputRef
    }), [searchInputRef]);
    useEffect(() => {
        if (visible && searchInputRef.current) {
            searchInputRef.current.select();
        }
    }, [visible]);
    return (
        <SearchOmnibar
            inputProps={searchInputProps as IInputGroupProps2}
            isOpen={visible}
            itemRenderer={renderResult}
            items={results}
            noResults={<MenuItem disabled text={t("search.modal.no-results")} />}
            onClose={onClose}
            onItemSelect={onSelect}
            onQueryChange={onSearch}
        />
    );
}
