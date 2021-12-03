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
import { AutoNav } from "./components/navigation/AutoNav";
import { AddVaultLanding } from "./components/AddVaultLanding";
import { LoadingScreen } from "./components/navigation/LoadingScreen";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { AddVaultMenu } from "./components/AddVaultMenu";
import { PreferencesDialog } from "./components/PreferencesDialog";
import { Notifications } from "./components/Notifications";
import { FileHostConnectionNotice } from "./components/FileHostConnectionNotice";
import { CreateNewFilePrompt } from "./components/CreateNewFilePrompt";
import { UpdateDialog } from "./components/standalone/UpdateDialog";
import { AboutDialog } from "./components/standalone/AboutDialog";
import { VaultManagementDialog } from "./components/standalone/VaultManagementDialog";
import { BiometricRegistrationDialog } from "./components/BiometricRegistrationDialog";
import { useTheme } from "./hooks/theme";
import { Theme } from "./types";
import { userCopiedText } from "./actions/clipboard";

const BaseContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: ${props => getThemeProp(props, "base.bgColor")};
`;

export function App() {
    const themeType = useTheme();
    return (
        <ThemeProvider
            theme={themeType === Theme.Dark ? THEME_DARK: THEME_LIGHT}
        >
            <BaseContainer onCopy={() => userCopiedText(document.getSelection().toString())}>
                <Router>
                    <Switch>
                        <Route path="/add-vault">
                            <AddVaultLanding />
                        </Route>
                        <Route path="/source/:id">
                            <VaultManagement />
                        </Route>
                        <Route path="/">
                            <AutoNav />
                        </Route>
                    </Switch>
                    <>
                        <PasswordPrompt />
                        <FileHostConnectionNotice />
                        <CreateNewFilePrompt />
                        <AddVaultMenu />
                        <PreferencesDialog />
                        <UpdateDialog />
                        <AboutDialog />
                        <VaultManagementDialog />
                        <BiometricRegistrationDialog />
                        <Notifications />
                        <LoadingScreen />
                    </>
                </Router>
            </BaseContainer>
        </ThemeProvider>
    );
}
