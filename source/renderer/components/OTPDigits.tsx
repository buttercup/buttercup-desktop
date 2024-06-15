import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Intent, Spinner, Text } from "@blueprintjs/core";
import * as OTPAuth from "otpauth";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
`;
const DigitsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-wrap: none;
`;
const Digits = styled(Text)`
    font-family: monospace;
    font-size: 2em;
    word-break: keep-all;
`;
const TimeLeftSpinner = styled(Spinner)`
    margin-right: 8px;
`;

export class OTPDigits extends Component<{
    otpRef: (digits: string) => void;
    otpURI: string;
}> {
    static defaultProps = {
        otpRef: n => n
    };

    static propTypes = {
        otpRef: PropTypes.func.isRequired,
        otpURI: PropTypes.string.isRequired
    };

    private __interval: ReturnType<typeof setInterval>;
    private __totp: OTPAuth.TOTP | OTPAuth.HOTP | null = null;

    state = {
        digits: "",
        error: false,
        otpRef: () => {},
        otpURI: null,
        period: 30,
        timeLeft: 30
    };

    componentDidMount() {
        this.update();
        this.__interval = setInterval(() => this.update(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.__interval);
    }

    render() {
        const leftDigits = this.state.digits.substring(0, this.state.digits.length / 2);
        const rightDigits = this.state.digits.substring(this.state.digits.length / 2);
        return (
            <Container>
                {this.state.error || typeof this.state.period !== "number" || isNaN(this.state.timeLeft) && (
                    <Fragment>
                        <TimeLeftSpinner
                            intent={Intent.DANGER}
                            size={30}
                            value={1}
                        />
                        <DigitsContainer>
                            <Digits>ERROR</Digits>
                        </DigitsContainer>
                    </Fragment>
                ) || (
                    <Fragment>
                        <TimeLeftSpinner
                            intent={this.state.timeLeft > 7 ? Intent.PRIMARY : Intent.DANGER}
                            size={30}
                            value={this.state.timeLeft / this.state.period}
                        />
                        <DigitsContainer>
                            <Digits>{leftDigits}</Digits>
                            &nbsp;
                            <Digits>{rightDigits}</Digits>
                        </DigitsContainer>
                    </Fragment>
                )}
            </Container>
        );
    }

    update(props = this.props) {
        let period = this.state.period;
        try {
            if (this.state.otpURI !== props.otpURI) {
                this.__totp = OTPAuth.URI.parse(props.otpURI);
                if (this.__totp instanceof OTPAuth.TOTP === false) {
                    throw new Error("Bad OTP");
                }
                period = this.__totp.period;
                this.setState({
                    otpURI: props.otpURI,
                    period
                });
            }
            if (!this.__totp) {
                throw new Error("No OTP initialised");
            }
            const digits = this.__totp.generate();
            this.setState({
                digits,
                timeLeft: period - (Math.floor(Date.now() / 1000) % period)
            });
            this.props.otpRef(digits);
        } catch (err) {
            console.error(err);
            clearInterval(this.__interval);
            this.setState({ error: true });
        }
    }
}
