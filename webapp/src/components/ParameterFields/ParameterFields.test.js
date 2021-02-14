import React from "react";
import { render, screen } from '@testing-library/react';

import ParameterFields from "./ParameterFields";

const inputNames = [
    "iterations",
    "octaves",
    "octavescale",
    "jitter",
    "stepsize"
];

const defaultParamValues = {
    iterations: 10,
    octaves: 4,
    octavescale: 1.4,
    jitter: 32,
    stepsize: 1.5
}

const handleChange = (e) => {}
const updateParameterState = (name, value) => {}

const dummyProps = {
    callBacks: {
        onButtonChange: updateParameterState.bind(this),
        onInputChange: handleChange.bind(this),
    },
    state: defaultParamValues
}

describe("ParameterFields", () => {
    it("renders ParameterFields component", () => {

        render(<ParameterFields data={dummyProps} />);
        const inputFields = screen.getAllByRole("spinbutton");
        inputFields.forEach(inputField => {
            let test = inputNames.includes(inputField.name);
            expect(test).toBe(true)
        });
    });
});