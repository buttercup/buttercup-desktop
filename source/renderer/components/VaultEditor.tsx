import * as React from "react";

interface VaultEditorProps {
    sourceID: string;
}

export function VaultEditor(props: VaultEditorProps) {
    return (
        <div>
            Source: {props.sourceID}
        </div>
    );
}
