import React from "react";
import { EntryFacade, EntryPropertyType } from "buttercup";

const generateHighlightedText = (text, regions) => {
    if (!regions) return text;

    const content: Array<string | JSX.Element> = [];
    let nextUnhighlightedRegionStartingIndex = 0;

    for (let region of regions) {
        const [start, end] = region;
        content.push(
            text.substring(nextUnhighlightedRegionStartingIndex, start),
            <mark>{text.substring(start, end + 1)}</mark>
        );
        nextUnhighlightedRegionStartingIndex = end + 1;
    }
    content.push(text.substring(nextUnhighlightedRegionStartingIndex));

    return (
        <>
            {content.map((text, i) => (
                <span key={i}>{text}</span>
            ))}
        </>
    );
};

export function getFacadeField(facade: EntryFacade, fieldName: string) {
    const fieldIndex = facade.fields.findIndex(
        field => field.propertyType === EntryPropertyType.Property && field.property === fieldName
    );
    if (fieldIndex < 0) {
        return "";
    }

    const field = facade.fields[fieldIndex];
    let value = field.value;
    // if (Array.isArray(matches)) {
    //     const match = matches.find(match => match.arrayIndex === fieldIndex);
    //     if (match) {
    //         return generateHighlightedText(value, match.indices);
    //     }
    // }

    return value;
}
