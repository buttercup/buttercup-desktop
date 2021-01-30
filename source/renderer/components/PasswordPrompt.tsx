import * as React from "react";
import { useState } from "@hookstate/core";
import styled from "styled-components";
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { getPasswordEmitter } from "../services/password";
import { SHOW_PROMPT } from "../state/password";

const { useCallback, useMemo } = React;

export function PasswordPrompt() {
    const emitter = useMemo(getPasswordEmitter, []);
    const showPromptState = useState(SHOW_PROMPT);
    const currentPassword = useState("");
    const close = useCallback(() => {
        currentPassword.set(""); // clear
        emitter.emit("password", null);
    }, [emitter]);
    const submitAndClose = useCallback(password => {
        currentPassword.set(""); // clear
        emitter.emit("password", password);
    }, [emitter]);
    const handleKeyPress = useCallback(event => {
        if (event.key === "Enter") {
            submitAndClose(currentPassword.get());
        }
    }, []);
    return (
        <Dialog isOpen={showPromptState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Vault Unlock</div>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup
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
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={() => submitAndClose(currentPassword.get())}
                        title="Confirm vault unlock"
                    >
                        Unlock
                    </Button>
                    <Button
                        onClick={close}
                        title="Cancel Unlock"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
