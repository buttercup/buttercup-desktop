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
import { LoadingScreen } from "./components/navigation/LoadingScreen";

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
                            <VaultManagement />
                        </Route>
                    </Switch>
                </Router>
                <LoadingScreen />
            </BaseContainer>
        </ThemeProvider>
    );
}
