import React, { Fragment, useCallback, useContext, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import cx from "classnames";
import TextArea from "react-textarea-autosize";
import { useDropzone } from "react-dropzone";
import {
    Button,
    ButtonGroup,
    Card,
    Classes,
    ControlGroup,
    Dialog,
    Drawer,
    EditableText,
    HTMLSelect,
    Icon,
    IconName,
    InputGroup,
    Intent,
    MaybeElement,
    Menu,
    MenuDivider,
    MenuItem,
    NonIdealState,
    Popover,
    Position,
    Text
} from "@blueprintjs/core";
import { AttachmentDetails, Entry, EntryChangeType, EntryFacade, EntryPropertyValueType, EntryType } from "buttercup";
import { FormattedInput, FormattedText } from "@buttercup/react-formatted-input";
import formatBytes from "xbytes";
import { useCurrentEntry, useGroups } from "./hooks/vault";
import { PaneContainer, PaneContent, PaneHeader, PaneFooter } from "./Pane";
import { VaultContext } from "./VaultContext";
import { ConfirmButton } from "./ConfirmButton";
import CreditCard from "./CreditCard";
import { copyToClipboard } from "../../library/clipboard";
import { OTPDigits } from "../OTPDigits";
import { t } from "../../../shared/i18n/trans";
import { getThemeProp } from "./utils/theme";
import { ErrorBoundary } from "../ErrorBoundary";
import { PasswordGenerator } from "../standalone/PasswordGenerator";

interface AttachmentItem extends AttachmentDetails {
    sizeEncFriendly: string;
    sizeOrigFriendly: string;
    icon: IconName | MaybeElement;
}

const ENTRY_ATTACHMENT_ATTRIB_PREFIX = Entry.Attributes.AttachmentPrefix;
const FIELD_TYPE_OPTIONS: Array<{
    i18nKey: string;
    icon: IconName | MaybeElement;
    type: EntryPropertyValueType;
}> = [
    { type: EntryPropertyValueType.Text, i18nKey: "custom-fields.field-type.text", icon: "italic" },
    {
        type: EntryPropertyValueType.Note,
        i18nKey: "custom-fields.field-type.note",
        icon: "align-left"
    },
    {
        type: EntryPropertyValueType.Password,
        i18nKey: "custom-fields.field-type.password",
        icon: "key"
    },
    { type: EntryPropertyValueType.OTP, i18nKey: "custom-fields.field-type.otp", icon: "time" }
];

function iconName(mimeType) {
    if (/^image\//.test(mimeType)) {
        return "media";
    }
    return "document";
}

function mimeTypePreviewable(mimeType) {
    if (/^image\//.test(mimeType)) {
        return true;
    }
    return false;
}

function title(entry, untitledText) {
    const titleField = entry.fields.find(
        item => item.propertyType === "property" && item.property === "title"
    );
    return titleField ? titleField.value : <i>{untitledText}</i>;
}

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    flex: 1;

    > div button {
        margin-right: 10px;
    }
`;
const AttachmentDropInstruction = styled.div`
    padding: 20px;
    width: 100%;
    border: 2px dashed ${p => getThemeProp(p, "attachment.dropBorder")};
    border-radius: 6px;
    background-color: ${p => getThemeProp(p, "attachment.dropBackground")};
    font-style: italic;
    text-align: center;
    color: ${p => getThemeProp(p, "attachment.dropText")};
`;
const AttachmentDropZone = styled.div<{ visible?: boolean; }>`
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    background-color: rgba(255, 255, 255, 0.85);
    display: ${props => (props.visible ? "flex" : "none")};
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > span {
        font-size: 16px;
        font-weight: bold;
        margin-top: 10px;
    }
`;
const AttachmentInfoContainer = styled.div`
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
`;
const AttachmentItem = styled(Card)`
    margin: 4px !important;
    padding: 4px !important;
    width: 104px;
    height: 110px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;
const AttachmentItemSize = styled.div`
    width: 100%;
    overflow: hidden;
    text-align: center;
    font-size: 10px;
    user-select: none;
    color: #888;
`;
const AttachmentItemTitle = styled.div`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 11px;
    user-select: none;
`;
const AttachmentPreviewContainer = styled.div`
    width: 100%;
    height: 300px;
    overflow: hidden;
    background: black;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const AttachmentPreviewImage = styled.img`
    max-height: 100%;
    max-width: 100%;
`;
const AttachmentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
`;
const ValueWithNewLines = styled.span`
    white-space: pre-wrap;
`;
const FormContainer = styled.div<{ primary?: boolean; }>`
    background-color: ${p =>
        p.primary ? getThemeProp(p, "entry.primaryContainer") : "transparent"};
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
`;
const CustomFieldsHeading = styled.h5`
    color: ${p => getThemeProp(p, "entry.separatorTextColor")};
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    margin-bottom: 0;

    &:before,
    &:after {
        display: flex;
        content: "";
        height: 1px;
        background-color: ${p => getThemeProp(p, "entry.separatorBorder")};
        width: 100%;
    }

    span {
        padding: 0 0.5rem;
    }
`;
const FieldRowContainer = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
`;
const FieldRowLabel = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${p => getThemeProp(p, "entry.separatorTextColor")};
    width: 100px;
    margin-right: 1rem;
`;
const FieldRowChildren = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex: 1;

    ${`.${Classes.CONTROL_GROUP}`} {
        flex: 1;
    }
`;

const FieldTextToolbar = styled(ButtonGroup)`
    margin-left: 0.5rem;
    opacity: 0;
`;
const FieldTextWrapper = styled.div<{ disabled?: boolean; }>`
    border: 1px dashed transparent;
    border-radius: 2px;
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
    word-break: break-all;
    pointer-events: ${p => (p.disabled ? "none" : "all")};

    &:hover {
        border-color: ${p =>
            p.disabled ? "transparent" : getThemeProp(p, "entry.fieldHoverBorder")};

        ${FieldTextToolbar} {
            opacity: ${p => (p.disabled ? 0 : 1)};
        }
    }
`;
const HistoryTable = styled.table`
    width: 100%;
`;
const HistoryScrollContainer = styled.div`
    width: 100%;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
`;
const NoWrapText = styled.span`
    word-break: keep-all;
`;

const Attachments = ({
    attachmentPreviews = {},
    entryFacade,
    onDeleteAttachment = () => {},
    onDownloadAttachment = () => {},
    onPreviewAttachment = () => {},
    readOnly = false
}: {
    attachmentPreviews?: Record<string, string>;
    entryFacade: EntryFacade;
    onDeleteAttachment?: (attachment: AttachmentItem) => void;
    onDownloadAttachment?: (attachment: AttachmentItem) => void;
    onPreviewAttachment?: (attachment: AttachmentItem) => void;
    readOnly?: boolean;
}) => {
    const [deletingAttachment, setDeletingAttachment] = useState<AttachmentItem | null>(null);
    const [previewingAttachment, setPreviewingAttachment] = useState<AttachmentItem | null>(null);
    const onAttachmentItemClick = useCallback((evt, attachment: AttachmentItem) => {
        evt.stopPropagation();
        setPreviewingAttachment(attachment);
    }, []);
    const attachments = entryFacade.fields.reduce((output: Array<AttachmentItem>, field) => {
        if (
            field.propertyType !== "attribute" ||
            field.property.indexOf(ENTRY_ATTACHMENT_ATTRIB_PREFIX) !== 0
        ) {
            return output;
        }
        const attachment = JSON.parse(field.value) as AttachmentDetails;
        return [
            ...output,
            {
                ...attachment,
                sizeEncFriendly: formatBytes(attachment.sizeEncrypted, { iec: true }),
                sizeOrigFriendly: formatBytes(attachment.sizeOriginal, { iec: true }),
                icon: iconName(attachment.type)
            } satisfies AttachmentItem
        ];
    }, []);
    return (
        <AttachmentsContainer>
            {attachments.length === 0 && (
                <AttachmentDropInstruction>
                    {t("vault-ui.attachments.drop-instruction")}
                </AttachmentDropInstruction>
            )}
            {attachments.map(attachment => {
                <AttachmentItem
                    key={attachment.id}
                    title={attachment.name}
                    onClick={evt => {
                        onPreviewAttachment(attachment);
                        onAttachmentItemClick(evt, attachment);
                    }}
                >
                    <Icon icon={attachment.icon} iconSize={56} color="rgba(0,0,0,0.6)" />
                    <AttachmentItemSize>{attachment.sizeEncFriendly}</AttachmentItemSize>
                    <AttachmentItemTitle>{attachment.name}</AttachmentItemTitle>
                </AttachmentItem>
            })}
            <Drawer
                icon={(previewingAttachment && previewingAttachment.icon) || undefined}
                isOpen={!!previewingAttachment}
                onClose={() => setPreviewingAttachment(null)}
                position={Position.RIGHT}
                size="45%"
                title={(previewingAttachment && previewingAttachment.name) || ""}
            >
                {previewingAttachment && (
                    <Fragment>
                        <AttachmentInfoContainer className={Classes.DRAWER_BODY}>
                            {mimeTypePreviewable(previewingAttachment.type) && (
                                <Fragment>
                                    <AttachmentPreviewContainer
                                        className={
                                            attachmentPreviews[previewingAttachment.id]
                                                ? ""
                                                : Classes.SKELETON
                                        }
                                    >
                                        {attachmentPreviews[previewingAttachment.id] && /^image\//.test(previewingAttachment.type) && (
                                            <AttachmentPreviewImage
                                                src={`data:${previewingAttachment.type};base64,${
                                                    attachmentPreviews[previewingAttachment.id]
                                                }`}
                                            />
                                        )}
                                    </AttachmentPreviewContainer>
                                    <br />
                                </Fragment>
                            )}
                            <table
                                className={cx(
                                    Classes.HTML_TABLE,
                                    Classes.HTML_TABLE_STRIPED,
                                    Classes.SMALL
                                )}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>ID</strong>
                                        </td>
                                        <td>
                                            <code>{previewingAttachment.id}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Filename</strong>
                                        </td>
                                        <td>
                                            <code>{previewingAttachment.name}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Type</strong>
                                        </td>
                                        <td>{previewingAttachment.type}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Size</strong>
                                        </td>
                                        <td>{previewingAttachment.sizeOrigFriendly}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Stored</strong>
                                        </td>
                                        <td>{previewingAttachment.sizeEncFriendly}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Date added</strong>
                                        </td>
                                        <td>{previewingAttachment.created}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </AttachmentInfoContainer>
                        <div className={Classes.DRAWER_FOOTER}>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => onDownloadAttachment(previewingAttachment)}
                                title={t("vault-ui.attachments.download-title")}
                            >
                                {t("vault-ui.attachments.download")}
                            </Button>
                            &nbsp;
                            <Button
                                intent={Intent.DANGER}
                                onClick={() => setDeletingAttachment(previewingAttachment)}
                                title={t("vault-ui.attachments.delete-title")}
                                disabled={readOnly}
                            >
                                {t("vault-ui.attachments.delete")}
                            </Button>
                        </div>
                    </Fragment>
                )}
            </Drawer>
            <Dialog isOpen={!!deletingAttachment} onClose={() => setDeletingAttachment(null)}>
                {deletingAttachment && (
                    <Fragment>
                        <div className={Classes.DIALOG_HEADER}>
                            {t("attachments.confirm.delete-prompt-title", {
                                title: deletingAttachment?.name
                            })}
                        </div>
                        <div className={Classes.DIALOG_BODY}>
                            {t("vault-ui.attachments.confirm.delete-prompt")
                                .split("vault-ui.\n")
                                .map(line => (
                                    <p>{line}</p>
                                ))}
                        </div>
                        <div className={Classes.DIALOG_FOOTER}>
                            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                <Button
                                    intent={Intent.DANGER}
                                    onClick={() => {
                                        const attachmentItem = deletingAttachment;
                                        setDeletingAttachment(null);
                                        setPreviewingAttachment(null);
                                        attachmentItem && onDeleteAttachment(attachmentItem);
                                    }}
                                    title={t("vault-ui.attachments.confirm.delete-title")}
                                    disabled={readOnly}
                                >
                                    {t("vault-ui.attachments.confirm.delete")}
                                </Button>
                                <Button
                                    onClick={() => setDeletingAttachment(null)}
                                    title={t("vault-ui.attachments.confirm.cancel-title")}
                                >
                                    {t("vault-ui.attachments.confirm.cancel")}
                                </Button>
                            </div>
                        </div>
                    </Fragment>
                )}
            </Dialog>
        </AttachmentsContainer>
    );
};

const FieldText = ({ entryFacade, field }) => {
    const { onUserCopy } = useContext(VaultContext);
    const [visible, toggleVisibility] = useState(false);
    const [historyDialogVisible, setHistoryDialogVisible] = useState(false);
    const otpRef = useRef(field.value);
    const { onFieldUpdateInPlace } = useCurrentEntry();
    const Element = field.valueType === EntryPropertyValueType.Password ? "code" : "span";
    const { _changes: history = [] } = entryFacade;
    const historyItems = useMemo(() => {
        const items = history.filter(
            item => item.property === field.property && item.type !== EntryChangeType.Deleted
        );
        return items;
    }, [history]);
    return (
        <FieldTextWrapper role="content" disabled={!field.value}>
            {field.valueType === EntryPropertyValueType.OTP && (
                <OTPDigits otpURI={field.value} otpRef={value => (otpRef.current = value)} />
            ) || (!field.value && (
                <Text className={Classes.TEXT_MUTED}>Not set.</Text>
            )) || (field.valueType === EntryPropertyValueType.Note && (
                <ValueWithNewLines>{field.value}</ValueWithNewLines>
            )) || (field.formatting && field.formatting.options && (
                <Fragment>
                    {typeof field.formatting.options === "object"
                        ? field.formatting.options[field.value] || field.value
                        : field.value}
                </Fragment>
            )) || (
                <Element>
                    {field.valueType === EntryPropertyValueType.Password && !visible && (
                        <NoWrapText>●●●●●●●●</NoWrapText>
                    ) || (
                        <FormattedText
                            format={
                                field.formatting && field.formatting.format
                                    ? field.formatting.format
                                    : undefined
                            }
                            value={field.value || ""}
                        />
                    )}
                </Element>
            )}
            <FieldTextToolbar>
                {field.valueType === EntryPropertyValueType.Password && (
                    <Button
                        text={
                            visible
                                ? t("vault-ui.entry.field-controls.password.hide")
                                : t("vault-ui.entry.field-controls.password.reveal")
                        }
                        small
                        onClick={() => toggleVisibility(!visible)}
                    />
                )}
                <Button
                    icon="clipboard"
                    small
                    onClick={() => {
                        copyToClipboard(otpRef.current);
                        if (onUserCopy) onUserCopy(otpRef.current);
                    }}
                />
                <Button
                    icon="history"
                    small
                    disabled={historyItems.length <= 0}
                    onClick={() => setHistoryDialogVisible(true)}
                />
            </FieldTextToolbar>
            <Dialog
                icon="history"
                onClose={() => setHistoryDialogVisible(false)}
                title="Entry field history"
                isOpen={historyDialogVisible}
            >
                <div className={Classes.DIALOG_BODY}>
                    <HistoryScrollContainer>
                        <HistoryTable
                            className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_CONDENSED)}
                        >
                            <thead>
                                <tr>
                                    <th>Previous Value</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyItems.map((change, idx) => (
                                    <tr key={`history-${idx}`}>
                                        <td>
                                            <code>{change.value}</code>
                                        </td>
                                        <td>
                                            {change.ts && (
                                                <Fragment>
                                                    {new Date(change.ts).toLocaleTimeString()}{" "}
                                                    {new Date(change.ts).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric"
                                                    })}
                                                </Fragment>
                                            )}
                                        </td>
                                        <td>
                                            <ButtonGroup>
                                                <Button
                                                    icon="clipboard"
                                                    onClick={() => copyToClipboard(change.value)}
                                                />
                                                <Button
                                                    icon="redo"
                                                    onClick={() => {
                                                        setHistoryDialogVisible(false);
                                                        onFieldUpdateInPlace(
                                                            entryFacade.id,
                                                            field,
                                                            change.value
                                                        );
                                                    }}
                                                />
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </HistoryTable>
                    </HistoryScrollContainer>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            intent={Intent.PRIMARY}
                            onClick={() => setHistoryDialogVisible(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Dialog>
        </FieldTextWrapper>
    );
};

const FieldRow = ({
    field,
    editing,
    entryFacade,
    onFieldNameUpdate,
    onFieldUpdate,
    onFieldSetValueType,
    onRemoveField
}) => {
    const [passwordMgrVisible, setPasswordMgrVisible] = useState(false);
    const label =
        editing && field.removeable ? (
            <EditableText
                placeholder={t("vault-ui.entry.click-to-edit")}
                value={field.property}
                onChange={value => {
                    onFieldNameUpdate(field, value);
                }}
            />
        ) : (
            field.title || field.property
        );
    const renderMenu = (
        <Menu>
            {/*
        The following is in the parent level due to:
          - https://github.com/palantir/blueprint/issues/2796
          - https://github.com/palantir/blueprint/issues/3010#issuecomment-443031120
      */}
            {FIELD_TYPE_OPTIONS.map(fieldTypeOption => (
                <MenuItem
                    key={fieldTypeOption.type}
                    text={`${t("vault-ui.custom-fields.change-type")} ${t(fieldTypeOption.i18nKey)}`}
                    icon={fieldTypeOption.icon}
                    labelElement={
                        field.valueType === fieldTypeOption.type ? <Icon icon="small-tick" /> : undefined
                    }
                    onClick={() => {
                        onFieldSetValueType(field, fieldTypeOption.type);
                    }}
                />
            ))}
            <MenuDivider />
            <MenuItem
                text={t("vault-ui.custom-fields.delete-field")}
                icon="trash"
                onClick={() => onRemoveField(field)}
            />
        </Menu>
    );
    return (
        <FieldRowContainer>
            {!(field.valueType === EntryPropertyValueType.Note && !field.removeable) && (
                <FieldRowLabel>{label}</FieldRowLabel>
            )}
            <FieldRowChildren>
                {editing && (
                    <ControlGroup>
                        {field.valueType === EntryPropertyValueType.Note && (
                            <TextArea
                                className={cx(Classes.INPUT, Classes.FILL)}
                                value={field.value}
                                onChange={val => onFieldUpdate(field, val.target.value)}
                            />
                        ) || (field.formatting && field.formatting.options && (
                            <HTMLSelect
                                fill
                                defaultValue={
                                    field.value ? undefined : field.formatting.defaultOption
                                }
                                value={field.value || undefined}
                                onChange={event => onFieldUpdate(field, event.target.value)}
                            >
                                {typeof field.formatting.options === "object" && (
                                    <Fragment>
                                        {Object.keys(field.formatting.options).map(optionValue => (
                                            <option key={optionValue} value={optionValue}>
                                                {field.formatting.options[optionValue]}
                                            </option>
                                        ))}
                                    </Fragment>
                                ) || (
                                    <Fragment>
                                        {field.formatting.options.map(optionValue => (
                                            <option key={optionValue} value={optionValue}>
                                                {optionValue}
                                            </option>
                                        ))}
                                    </Fragment>
                                )}
                            </HTMLSelect>
                        )) || (
                            <FormattedInput
                                minimal
                                className={Classes.FILL}
                                element={InputGroup}
                                value={field.value}
                                onChange={(formattedValue, raw) =>
                                    onFieldUpdate(field, raw)
                                }
                                placeholder={
                                    field.formatting && field.formatting.placeholder
                                        ? field.formatting.placeholder
                                        : field.title
                                }
                                format={
                                    field.formatting && field.formatting.format
                                        ? field.formatting.format
                                        : undefined
                                }
                            />
                        )}
                        {field.valueType === "password" && (
                            <Fragment>
                                <PasswordGenerator
                                    isOpen={passwordMgrVisible}
                                    onClose={() => setPasswordMgrVisible(false)}
                                    onGenerate={newPass => {
                                        onFieldUpdate(field, newPass);
                                        setPasswordMgrVisible(false);
                                    }}
                                >
                                    <span>{/* hack to fix resize-sensor UI breakage */}</span>
                                </PasswordGenerator>
                                <Button
                                    icon="key"
                                    onClick={() => setPasswordMgrVisible(!passwordMgrVisible)}
                                />
                            </Fragment>
                        )}
                        {field.removeable && (
                            <Popover
                                content={renderMenu}
                                boundary="viewport"
                                captureDismiss={false}
                            >
                                <Button icon="cog" />
                            </Popover>
                        )}
                    </ControlGroup>
                ) || (
                    <Fragment>
                        {field.property === "url" ? (
                            <a
                                onClick={e => {
                                    (e.ctrlKey || e.metaKey) && window.open(field.value, "_blank");
                                }}
                                target="_blank"
                                title="open with Ctrl/Cmd + click"
                            >
                                <FieldText field={field} entryFacade={entryFacade} />
                            </a>
                        ) : (
                            <FieldText field={field} entryFacade={entryFacade} />
                        )}
                    </Fragment>
                )}
            </FieldRowChildren>
        </FieldRowContainer>
    );
};

const EntryDetailsContent = () => {
    const {
        attachments: supportsAttachments,
        attachmentPreviews,
        onDeleteAttachment,
        onDownloadAttachment,
        onPreviewAttachment,
        readOnly
    } = useContext(VaultContext);
    const {
        entry,
        editing: isEditing,
        onAddField,
        onCancelEdit,
        onEdit,
        onFieldNameUpdate,
        onFieldUpdate,
        onFieldSetValueType,
        onRemoveField,
        onSaveEdit
    } = useCurrentEntry();
    const { onMoveEntryToTrash, trashID } = useGroups();

    const editing = isEditing && !readOnly;

    const editableFields = useMemo(() => {
        if (!entry) return [];
        return editing
            ? entry.fields.filter(item => item.propertyType === "property")
            : entry.fields.filter(
                item => item.propertyType === "property" && item.property !== "title"
            );
    }, [editing, entry]);
    const mainFields = useMemo(() => editableFields.filter(field => !field.removeable), [editableFields]);
    const removeableFields = useMemo(() => editableFields.filter(field => field.removeable), [editableFields]);
    const hasUntitledFields = useMemo(() => removeableFields.some(field => !field.property), [removeableFields]);

    return (
        <>
            <PaneHeader
                title={editing ? t("vault-ui.entry.edit-document") : title(entry, t("vault-ui.entry.untitled"))}
            />
            <PaneContent>
                {entry?.type === EntryType.CreditCard && (
                    <CreditCard entry={entry} />
                )}
                <FormContainer primary>
                    {mainFields.map(field => (
                        <FieldRow
                            key={field.id}
                            entryFacade={entry}
                            field={field}
                            onFieldNameUpdate={onFieldNameUpdate}
                            onFieldUpdate={onFieldUpdate}
                            onRemoveField={onRemoveField}
                            onFieldSetValueType={onFieldSetValueType}
                            editing={editing}
                        />
                    ))}
                </FormContainer>
                {editing || removeableFields.length > 0 && (
                    <CustomFieldsHeading>
                        <span>{t("vault-ui.entry.custom-fields")}</span>
                    </CustomFieldsHeading>
                )}
                {removeableFields.length > 0 && (
                    <FormContainer>
                        {removeableFields.map(field => (
                            <FieldRow
                                key={field.id}
                                entryFacade={entry}
                                field={field}
                                onFieldNameUpdate={onFieldNameUpdate}
                                onFieldUpdate={onFieldUpdate}
                                onFieldSetValueType={onFieldSetValueType}
                                onRemoveField={onRemoveField}
                                editing={editing}
                            />
                        ))}
                    </FormContainer>
                )}
                {editing && (
                    <Button
                        onClick={onAddField}
                        text={t("vault-ui.entry.add-custom-field-btn")}
                        icon="small-plus"
                    />
                )}
                {!editing && supportsAttachments && (
                    <Fragment>
                        <CustomFieldsHeading>
                            <span>{t("vault-ui.entry.attachments")}</span>
                        </CustomFieldsHeading>
                        {entry && (
                            <Attachments
                                attachmentPreviews={attachmentPreviews}
                                entryFacade={entry}
                                onDeleteAttachment={attachment =>
                                    onDeleteAttachment(entry.id, attachment.id)
                                }
                                onDownloadAttachment={attachment =>
                                    onDownloadAttachment(entry.id, attachment.id)
                                }
                                onPreviewAttachment={attachment =>
                                    onPreviewAttachment(entry.id, attachment.id)
                                }
                                readOnly={readOnly}
                            />
                        )}
                    </Fragment>
                )}
            </PaneContent>
            <PaneFooter>
                <ActionBar>
                    {!editing && entry && (
                        <Button
                            onClick={onEdit}
                            icon="edit"
                            disabled={readOnly || entry.parentID === trashID}
                        >
                            {t("vault-ui.entry.edit")}
                        </Button>
                    )}
                    {editing && (
                        <Fragment>
                            <div>
                                <Button
                                    disabled={readOnly || hasUntitledFields}
                                    icon="tick"
                                    intent={Intent.PRIMARY}
                                    onClick={onSaveEdit}
                                    title={
                                        readOnly
                                            ? t("vault-ui.entry.save-disabled-title.readonly")
                                            : hasUntitledFields
                                            ? t("vault-ui.entry.save-disabled-title.untitled")
                                            : undefined
                                    }
                                >
                                    {t("vault-ui.entry.save")}
                                </Button>
                                <Button onClick={onCancelEdit}>{t("vault-ui.entry.cancel-edit")}</Button>
                            </div>
                            {entry && !entry.isNew && (
                                <ConfirmButton
                                    danger
                                    description={t("vault-ui.entry.trash-move.message")}
                                    disabled={readOnly}
                                    icon="trash"
                                    onClick={() => onMoveEntryToTrash(entry.id)}
                                    primaryAction={t("vault-ui.entry.trash-move.trash-btn")}
                                    title={t("vault-ui.entry.trash-move.title")}
                                />
                            )}
                        </Fragment>
                    )}
                </ActionBar>
            </PaneFooter>
        </>
    );
};

export const EntryDetails = () => {
    const { editing, entry } = useCurrentEntry();
    const {
        attachments: supportsAttachments,
        attachmentsMaxSize,
        onAddAttachments,
        readOnly
    } = useContext(VaultContext);
    const { getInputProps, getRootProps, isDragActive } = useDropzone({
        maxSize: attachmentsMaxSize,
        noClick: true,
        onDrop: files => {
            entry && onAddAttachments(entry.id, files);
        }
    });
    return (
        <ErrorBoundary>
            <PaneContainer {...(!editing && supportsAttachments ? getRootProps() : {})}>
                {!editing && (
                    <Fragment>
                        <AttachmentDropZone visible={isDragActive && !readOnly}>
                            <Icon icon="compressed" iconSize={30} />
                            <span>{t("vault-ui.attachments.drop-files")}</span>
                        </AttachmentDropZone>
                        <input {...getInputProps()} />
                    </Fragment>
                )}
                {entry && (
                    <EntryDetailsContent />
                ) || (
                    <PaneContent>
                        <NonIdealState
                            icon="document"
                            title={t("vault-ui.entry.none-selected.title")}
                            description={t("vault-ui.entry.none-selected.message")}
                        />
                    </PaneContent>
                )}
            </PaneContainer>
        </ErrorBoundary>
    );
};

