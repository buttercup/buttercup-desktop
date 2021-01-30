import React, { Component } from "react";
import styled from "styled-components";
import { Callout, Intent } from "@blueprintjs/core";

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
                <p>
                    A fatal error has occurred - we're sorry this happened. Please check out the details below
                    in case they help diagnose the issue:
                </p>
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
