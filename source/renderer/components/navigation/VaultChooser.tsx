import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { VaultSourceStatus } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { Button, Card, Elevation, Icon, MenuItem, NonIdealState } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { VAULTS_LIST } from "../../state/vaults";
import { showAddVaultMenu } from "../../state/addVault";
import { unlockVaultSource } from "../../actions/unlockVault";
import { getIconForProvider } from "../../library/icons";
import { getThemeProp } from "../../styles/theme";
import { VaultSourceDescription } from "../../types";

const { useCallback, useMemo, useState } = React;
const VaultSelect = Select.ofType<VaultSourceDescription>();

const ChooserContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const SelectVaultAnchor = styled.a`
    margin-top: 8px;
    font-style: italic;
    color: ${props => getThemeProp(props, "vaultChooser.selectVaultAnchor.color")} !important;
    &:hover {
        color: ${props => getThemeProp(props, "vaultChooser.selectVaultAnchor.hover")} !important;
        text-decoration: none;
    }
`;
const SelectVaultImage = styled.img`
    height: 20px;
    width: auto;
`;
const TargetVault = styled(Card)`
    padding: 8px 12px;
`;
const TargetVaultContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const TargetVaultImg = styled.img`
    width: 128px;
    height: auto;
`;

function noVaults() {
    return (
        <NonIdealState
            icon="key"
            title="A Clean Slate"
            description="No vaults have been added yet..."
        >
            <Button
                icon="add"
                onClick={() => showAddVaultMenu(true)}
                text="Add Vault"
            />
        </NonIdealState>
    );
}

export function VaultChooser() {
    const history = useHistory();
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const [selectedSourceID, setSelectedSourceID] = useState<string>(null);
    const [selectingVault, setSelectingVault] = useState(false);
    const selectedSource = useMemo(
        () => vaultsState.get().length > 0
            ? selectedSourceID
                ? vaultsState.get().find(item => item.id === selectedSourceID) || null
                : vaultsState.get()[0]
            : null,
        [selectedSourceID, vaultsState.get()]
    );
    const unlockSource = useCallback(async sourceID => {
        const source = vaultsState.get().find(item => item.id === sourceID);
        if (source.state !== VaultSourceStatus.Unlocked) {
            await unlockVaultSource(sourceID);
        }
        history.push(`/source/${sourceID}`);
    }, [vaultsState.get()]);
    return (
        <ChooserContainer>
            {vaultsState.get().length <= 0 && noVaults()}
            {selectedSource && (
                <>
                    <TargetVault
                        elevation={Elevation.ONE}
                        interactive
                        onClick={() => unlockSource(selectedSource.id)}
                    >
                        <TargetVaultContents>
                            <TargetVaultImg src={getIconForProvider(selectedSource.type)} />
                            <h3>
                                <Icon icon={selectedSource.state === VaultSourceStatus.Unlocked ? "unlock" : "lock"} />&nbsp;
                                {selectedSource.name}
                            </h3>
                        </TargetVaultContents>
                    </TargetVault>
                    {selectingVault && (
                        <>
                            <VaultSelect
                                filterable={false}
                                items={vaultsState.get()}
                                itemRenderer={(item: VaultSourceDescription, { handleClick }) => (
                                    <MenuItem
                                        icon={<SelectVaultImage src={getIconForProvider(item.type)} />}
                                        key={item.id}
                                        onClick={handleClick}
                                        text={item.name}
                                    />
                                )}
                                onItemSelect={(item: VaultSourceDescription) => {
                                    setSelectedSourceID(item.id);
                                    setSelectingVault(false);
                                }}
                            >
                                <Button
                                    icon={<SelectVaultImage src={getIconForProvider(selectedSource.type)} />}
                                    text={selectedSource && selectedSource.name}
                                    rightIcon="double-caret-vertical"
                                />
                            </VaultSelect>
                            <SelectVaultAnchor href="#" onClick={() => setSelectingVault(false)}>Hide vault chooser</SelectVaultAnchor>
                        </>
                    )}
                    {!selectingVault && (
                        <SelectVaultAnchor href="#" onClick={() => setSelectingVault(true)}>Select another vault</SelectVaultAnchor>
                    )}
                </>
            )}
        </ChooserContainer>
    );
}
