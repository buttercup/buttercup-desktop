import * as React from "react";
import { Intent, MenuItem } from "@blueprintjs/core";
import { Omnibar } from "@blueprintjs/select";
import { SiteIcon } from "@buttercup/ui";
import styled from "styled-components";
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

function renderResult(res: SearchResult, { handleClick, modifiers }) {
    if (!modifiers.matchesPredicate) return null;
    if (!res) return null;
    if (res.type === "entry") {
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                label={res.result.vaultID}
                key={res.result.id}
                onClick={handleClick}
                icon={<ResultIcon domain={getDomain(res)} />}
                text={res.result.properties.title}
            />
        );
    }
    return (
        <MenuItem disabled intent={Intent.DANGER} text="Failed rendering search result" />
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
    return (
        <SearchOmnibar
            itemRenderer={renderResult}
            items={results}
            noResults={<MenuItem disabled text="No results..." />}
            onClose={onClose}
            onItemSelect={onSelect}
            onQueryChange={onSearch}
            isOpen={visible}
        />
    );
}
