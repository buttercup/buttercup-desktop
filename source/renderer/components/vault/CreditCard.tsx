import React from "react";
import styled from "styled-components";
import Card from "elt-react-credit-cards";
import { EntryPropertyType } from "buttercup";

import "./styles/credit-card.sass";

const Container = styled.div`
    padding: 20px;
`;

export default function CreditCard(props) {
    const { entry } = props;
    const cc: Record<string, string> = {};
    entry.fields.forEach(field => {
        if (field.propertyType !== EntryPropertyType.Property) return;
        if (field.property === "cvv") cc.cvv = field.value;
        if (field.property === "username") cc.name = field.value;
        if (field.property === "password") cc.number = field.value;
        if (field.property === "valid_from") cc.valid = field.value;
        if (field.property === "expiry") cc.expiry = field.value;
    });
    return (
        <Container>
            <Card cvc={cc.cvv} expiry={cc.expiry} focused="" name={cc.name} number={cc.number} />
        </Container>
    );
}
