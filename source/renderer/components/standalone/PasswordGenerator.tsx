import React, { HTMLAttributes, useCallback, useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { generatePassword, getConfig } from "@buttercup/generator";
import Popover from "react-popover";
import { Button, Intent } from "@blueprintjs/core";
import { COLOURS } from "../../../shared/symbols";
import { copyToClipboard } from "../../library/clipboard";
import { selectElementContents } from "../../library/ui";

interface GeneratorUIProps {
    autoGenerate?: boolean;
    copyMode?: boolean;
    onError?: (err: Error) => void;
    onGenerate?: (password: string) => void;
}

const NOOP = () => {};

const ColoredDigits = ({ value, concealed, ...props }: {
    concealed?: boolean;
    value: string;
} & HTMLAttributes<HTMLSpanElement>) => {
    const splitted = value.split(/(\d+)/g);
    return (
        <span {...props}>
            {concealed
                ? "●".repeat(10)
                : splitted.map((chunk, i) => (
                      <span key={i} className={/^\d+$/.test(chunk) ? "num" : "str"}>
                          {chunk}
                      </span>
                  ))}
        </span>
    );
};

const PopoverStyles = createGlobalStyle`
  .Popover-tip {
    fill: ${COLOURS.DARK_SECONDARY};
  }

  .Popover-body {
    width: 300px;
    display: inline-flex;
    padding: 0;
    flex-direction: column;
  }
`;
const Password = styled(ColoredDigits)`
    .num {
        color: ${COLOURS.BRAND_PRIMARY};
    }
`;
const Body = styled.div`
    background: ${COLOURS.DARK_SECONDARY};
    padding: 12px;
    color: #fff;
    border-radius: 5px;
    font-weight: 300;
`;
const PasswordContainer = styled.pre`
    font-size: 0.9rem;
    padding: 6px;
    margin: 0;
    background-color: ${COLOURS.BLACK_25};
    border-radius: 3px;
    overflow: hidden;
    font-weight: 400;
    cursor: copy;
`;
const GenerationTypes = styled.div`
    margin: 12px 0;
    font-size: 0.9rem;

    label {
        display: block;
    }

    small {
        color: ${COLOURS.GRAY_DARK};
    }
`;
const GeneratorLabel = styled.div`
    display: block;
`;
const GeneratorRangeLabel = styled.div`
    display: flex;

    span {
        flex: 0;
        background-color: ${COLOURS.BLACK_25};
        padding: 0 3px;
        border-radius: 3px;
        font-family: monospace;
        width: 30px;
        margin-left: 6px;
    }

    input {
        flex: 1;
    }
`;
const GeneratorFieldset = styled.fieldset`
    border-color: ${COLOURS.WHITE_50};
    border-radius: 3px;
`;
const GeneratorLegend = styled.legend`
    text-transform: uppercase;
    padding: 0 6px;
    font-size: 0.8em;
`;
const GeneratorControls = styled.div`
    display: flex;
    margin-top: 12px;
    align-items: flex-start;
    flex-direction: row;

    button {
        width: 50%;

        &:first-child {
            margin-right: 6px;
        }
    }
`;

function GeneratorUserInterface({ autoGenerate = true, copyMode = false, onError = NOOP, onGenerate = NOOP }: GeneratorUIProps) {
    const [config, setConfig] = useState(getConfig);
    const [password, setPassword] = useState("");
    const enabledCharacterSets = useMemo(() => config.randomCharacters.enabledCharacterSets, [
        config
    ]);
    const changeType = useCallback(
        mode => {
            const newConfig = {
                ...config,
                mode
            };
            setConfig(newConfig);
            generateNewPassword(newConfig);
        },
        [config]
    );
    const changeLength = useCallback(
        length => {
            const newConfig = {
                ...config,
                randomCharacters: {
                    ...config.randomCharacters,
                    length
                }
            };
            setConfig(newConfig);
            generateNewPassword(newConfig);
        },
        [config]
    );
    const toggleCharacterSet = useCallback(
        setName => {
            const currentCharacterSets = [...config.randomCharacters.enabledCharacterSets];
            const charsetIndex = currentCharacterSets.indexOf(setName);
            if (charsetIndex >= 0) {
                currentCharacterSets.splice(charsetIndex, 1);
            } else {
                currentCharacterSets.push(setName);
            }
            const newConfig = {
                ...config,
                randomCharacters: {
                    ...config.randomCharacters,
                    enabledCharacterSets: currentCharacterSets
                }
            };
            setConfig(newConfig);
            generateNewPassword(newConfig);
        },
        [config]
    );
    const generateNewPassword = useCallback(
        (configOverride = null) => {
            generatePassword(configOverride || config)
                .then(password => {
                    setPassword(password);
                })
                .catch(err => {
                    // Errors for no selected character sets and max retries exceeded occur
                    // when the user selects too-restrictive options - we don't really care
                    // about the error, we just don't generate a password:
                    if (err.code !== "NO_CHARSETS" && err.code !== "MAX_RETRIES") {
                        // If it's some other error, pass it out
                        console.log(err);
                        onError(err);
                    }
                });
        },
        [config]
    );
    useEffect(() => {
        if (autoGenerate) generateNewPassword();
    }, []);
    return (
        <Body>
            <PasswordContainer role="content" onClick={e => selectElementContents(e.target as HTMLElement)}>
                <Password value={password} className="generated-password" />
            </PasswordContainer>
            <GenerationTypes>
                <GeneratorLabel>
                    <input
                        type="radio"
                        checked={config.mode === "characters"}
                        onChange={() => changeType("characters")}
                    />{" "}
                    Characters
                </GeneratorLabel>
                <GeneratorLabel>
                    <input
                        type="radio"
                        checked={config.mode === "words"}
                        onChange={() => changeType("words")}
                    />{" "}
                    Words
                </GeneratorLabel>
            </GenerationTypes>
            {config.mode === "characters" && (
                <GeneratorFieldset>
                    <GeneratorLegend>Options</GeneratorLegend>
                    <GeneratorRangeLabel>
                        <input
                            type="range"
                            value={config.randomCharacters.length}
                            min="10"
                            max="50"
                            onChange={e => changeLength(parseInt(e.target.value, 10))}
                        />
                        <span>{config.randomCharacters.length}</span>
                    </GeneratorRangeLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("UPPERCASE")}
                            onChange={() => toggleCharacterSet("UPPERCASE")}
                        />{" "}
                        Uppercase Letters
                    </GeneratorLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("LOWERCASE")}
                            onChange={() => toggleCharacterSet("LOWERCASE")}
                        />{" "}
                        Lowercase Letters
                    </GeneratorLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("DIGITS")}
                            onChange={() => toggleCharacterSet("DIGITS")}
                        />{" "}
                        Digits
                    </GeneratorLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("SPACE")}
                            onChange={() => toggleCharacterSet("SPACE")}
                        />{" "}
                        Space
                    </GeneratorLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("UNDERSCORE_DASH")}
                            onChange={() => toggleCharacterSet("UNDERSCORE_DASH")}
                        />{" "}
                        Underscore &amp; Dash
                    </GeneratorLabel>
                    <GeneratorLabel>
                        <input
                            type="checkbox"
                            checked={enabledCharacterSets.includes("SYMBOLS")}
                            onChange={() => toggleCharacterSet("SYMBOLS")}
                        />{" "}
                        Symbols
                    </GeneratorLabel>
                </GeneratorFieldset>
            )}
            <GeneratorControls>
                <Button onClick={() => generateNewPassword()} intent={Intent.PRIMARY} className="generate-button">
                    Generate
                </Button>
                {copyMode && (
                    <Button
                        onClick={() => {
                            copyToClipboard(password);
                            onGenerate(password);
                        }}
                    >
                        Copy
                    </Button>
                ) || (
                    <Button onClick={() => onGenerate(password)}>
                        Use This
                    </Button>
                )}
            </GeneratorControls>
        </Body>
    );
}

export const PasswordGenerator = ({ children, isOpen, className, onClose = NOOP, ...rest }: {
    children?: JSX.Element;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
} & GeneratorUIProps) => {
    const View = <GeneratorUserInterface {...rest} />;
    return (
        <>
            <PopoverStyles />
            <Popover
                body={View}
                className={className}
                hasBackdrop
                isOpen={isOpen}
                onClose={onClose}
            >
                {children}
            </Popover>
        </>
    );
};
