import * as React from "react";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { THEME_DARK, THEME_LIGHT } from "./styles/themes";
import { getThemeProp } from "./styles/theme";
import { VaultManagement } from "./components/VaultManagement";
import { VaultChooser } from "./components/navigation/VaultChooser";
import { LoadingScreen } from "./components/navigation/LoadingScreen";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { AddVaultMenu } from "./components/AddVaultMenu";
import { PreferencesDialog } from "./components/PreferencesDialog";
import { Notifications } from "./components/Notifications";

const BaseContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: ${props => getThemeProp(props, "base.bgColor")};
`;

export function App() {
    return (
        <ThemeProvider theme={true ? THEME_DARK: THEME_LIGHT}>
            <BaseContainer className={true ? "bp3-dark" : ""}>
                <Router>
                    <Switch>
                        <Route path="/source/:id">
                            <VaultManagement />
                        </Route>
                        <Route path="/">
                            <VaultChooser />
                        </Route>
                    </Switch>
                </Router>
                <>
                    <PasswordPrompt />
                    <AddVaultMenu />
                    <PreferencesDialog />
                    <Notifications />
                    <LoadingScreen />
                </>
            </BaseContainer>
        </ThemeProvider>
    );
}
