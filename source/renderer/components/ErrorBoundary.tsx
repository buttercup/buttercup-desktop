import React, { Component } from "react";
import styled from "styled-components";
import { Callout, Intent } from "@blueprintjs/core";
import { t } from "../../shared/i18n/trans";

const ErrorCallout = styled(Callout)`
    margin: 4px;
    box-sizing: border-box;
    width: calc(100% - 8px) !important;
    height: calc(100% - 8px) !important;
`;
const PreForm = styled.pre`
    margin: 0px;
`;

function stripBlanks(txt = '') {
    return txt
        .split(/(\r\n|\n)/g)
        .filter(ln => ln.trim().length > 0)
        .join('\n');
}

export class ErrorBoundary extends Component {
    static getDerivedStateFromError(error) {
        return { error };
    }

    state = {
        error: null,
        errorStack: null
    };

    componentDidCatch(error, errorInfo) {
        this.setState({ errorStack: errorInfo.componentStack || null });
    }

    render() {
        if (!this.state.error) {
            return this.props.children;
        }
        return (
            <ErrorCallout intent={Intent.DANGER} icon="heart-broken" title="Error">
                <p>{t("error.fatal-boundary")}</p>
                <code>
                    <PreForm>{this.state.error.toString()}</PreForm>
                </code>
                {this.state.errorStack && (
                    <code>
                        <PreForm>{stripBlanks(this.state.errorStack)}</PreForm>
                    </code>
                )}
            </ErrorCallout>
        );
    }
}
