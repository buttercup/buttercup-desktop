import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { VaultSourceID } from "buttercup";
import styled from "styled-components";
import { Button, NonIdealState, Tag } from "@blueprintjs/core";
import { showAddVaultMenu } from "../state/addVault";
import { getVaultAdditionEmitter } from "../services/addVault";
import { t } from "../../shared/i18n/trans";

const BENCH_IMAGE = require("../../../resources/images/bench.png").default;

const LockedImage = styled.img`
    max-height: 308px;
    width: auto;
`;
const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export function AddVaultLanding() {
    const history = useHistory();
    const vaultAdditionEmitter = useMemo(getVaultAdditionEmitter, []);
    useEffect(() => {
        const cb = (sourceID: VaultSourceID) => {
            history.push(`/source/${sourceID}`);
        };
        vaultAdditionEmitter.once("vault-added", cb);
        return () => {
            vaultAdditionEmitter.off("vault-added", cb);
        };
    }, [history, vaultAdditionEmitter]);
    return (
        <PrimaryContainer>
            <NonIdealState
                icon={
                    <LockedImage src={BENCH_IMAGE} />
                }
                title={t("add-vault-page.title")}
                description={t("add-vault-page.description")}
                action={
                    <Button
                        icon="plus"
                        onClick={() => showAddVaultMenu(true)}
                        text={t("add-vault-page.cta-button")}
                    />
                }
            />
        </PrimaryContainer>
    );
}
