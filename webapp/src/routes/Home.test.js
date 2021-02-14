import React from "react";
import userEvent from "@testing-library/user-event";
import fakeApi from "./fakeApi";

import {
    render, screen, fireEvent, within,
    waitForElementToBeRemoved,
    waitFor
} from "@testing-library/react";

import Home from "./Home"

//parameter field names
const inputNames = [
    "iterations",
    "octaves",
    "octavescale",
    "jitter",
    "stepsize"
];

//up and down buttons
const buttonsUpDown = inputNames.map(btn => [btn.concat("-up"), btn.concat("-down")]).flat();

//general buttons
const appButtons = [
    "What is DeepDream?",
    "Fork me on Github",
    "About",
    "Select input image",
    "Make it Dream",
    "Stop Dream",
    "Download Dream"
].concat(buttonsUpDown);


describe("Parameter input fields", () => {
    beforeEach(() => render(<Home />));
    
    it("change input parameters on user type", () => {
        //test each parameter input field
        inputNames.forEach(inputField => {
            let elem = screen.getByRole("spinbutton", { name: inputField });
            userEvent.clear(elem);
            userEvent.type(elem, "50");
            expect(elem).toHaveValue(50);
        });
    });

    it("change input parameters on down button click", () => {
        inputNames.forEach(inputField => {
            //get input field
            let elem = screen.getByRole("spinbutton", { name: inputField });
            //octavescale and stepsize use decimals instead of natural numbers
            const useFloat = elem.name == "octavescale" || elem.name == "stepsize";
            //save current input value
            const defaultValue = useFloat ? parseFloat(elem.value) : parseInt(elem.value);
            //get down button
            const downBtn = screen.getByRole("button", { name: `${inputField}-down` });
            //calculate correct expected value
            //we round off to 1 decimal place
            let expectedValue = defaultValue - (useFloat ? .1 : 1);
            //without this, 1.4 - 0.1 = 1.2999999999999998
            //we want 1.4 - 0.1 to be 1.3
            expectedValue = useFloat ? Math.round(expectedValue * 10) / 10 : expectedValue;
            //test click
            userEvent.click(downBtn);
            expect(elem).toHaveValue(expectedValue);
        });
    });

    it("change input parameters on up button click", () => {
        inputNames.forEach(inputField => {
            //get input field
            let elem = screen.getByRole("spinbutton", { name: inputField });
            //octavescale and stepsize use decimals instead of natural numbers
            const useFloat = elem.name == "octavescale" || elem.name == "stepsize";
            //save current input value
            const defaultValue = useFloat ? parseFloat(elem.value) : parseInt(elem.value);
            //get up button
            const upBtn = screen.getByRole("button", { name: `${inputField}-up` });
            //calculate correct expected value
            //we round off to 1 decimal place
            let expectedValue = defaultValue + (useFloat ? .1 : 1);
            //without this, 1.4 - 0.1 = 1.2999999999999998
            //we want 1.4 - 0.1 to be 1.3
            expectedValue = useFloat ? Math.round(expectedValue * 10) / 10 : expectedValue;
            //test click
            userEvent.click(upBtn);
            expect(elem).toHaveValue(defaultValue + (useFloat ? .1 : 1));
        });
    });
});

describe("Select layer (drop down meu)", () => {
    beforeEach(() => render(<Home />));

    it("change layer on dropdown select", async () => {
        const newLayer = "conv2/3x3";
        const defaultLayer = "inception_4c/output";

        //make sure layer is not in dom
        expect(screen.queryByText(newLayer)).not.toBeInTheDocument();
        //get dropDown button
        const dropDownBtn = screen.getByRole("button", { name: defaultLayer });
        //simulate mouseDown event on downDrop button
        fireEvent.mouseDown(dropDownBtn);
        //get drop down options
        const listBox = within(screen.getByRole("listbox"));
        //click on the name of our new layer
        userEvent.click(listBox.getByText(newLayer));
        //close dropDown menu (click away)
        fireEvent.keyDown(document.activeElement, {
            key: "Escape",
            code: "Escape"
        });
        // Wait for dropDown menu to close
        await waitForElementToBeRemoved(screen.getByText(defaultLayer));
        //verify new layer has been set
        expect(screen.getByRole("button", { name: newLayer })).toBeInTheDocument();
        //verify old layer is not in dom
        //this means the dropDown menu has been closed
        expect(screen.queryByText(defaultLayer)).not.toBeInTheDocument();
    });

});

describe("Main buttons", () => {
    beforeEach(() => render(<Home />));

    it("MAKE IT DREAM button is enabled", () => {
        const button = screen.getByRole("button", { name: /make it dream/i });
        expect(button).toBeEnabled();
    });

    it("STOP DREAM button is disabled", () => {
        const button = screen.getByRole("button", { name: /stop dream/i });
        expect(button).toBeDisabled();
    });

    it("DOWNLOAD DREAM button is disabled", () => {
        const button = screen.getByRole("button", { name: /download dream/i });
        expect(button).toBeDisabled();
    });
});

describe("MAKE IT DREAM BUTTON", () => {
    beforeEach(() => render(<Home />));

    it("shows error message if no file has been selected", async () => {
        const button = screen.getByRole("button", { name: /make it dream/i });
        userEvent.click(button);
        //verify error dialog window shows
        await waitFor(() => expect(screen.queryByRole("presentation")).toBeInTheDocument());
        expect(screen.getByText("You need to select a file first")).toBeInTheDocument();
        //click OK button to close dialog
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitForElementToBeRemoved(screen.queryByRole("presentation"));
        //the other buttons should remain disabled
        expect(screen.getByRole("button", { name: /stop dream/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /download dream/i })).toBeDisabled();
    });

});

describe("SEND IMAGE TO SERVER", () => {
    let api;
    beforeEach(async () => {
        //setup fake api
        api = new fakeApi();
        jest.spyOn(window, 'fetch');
        window.fetch.mockImplementation(url => api.fetch(url));
        window.URL.createObjectURL = function (data) { return api.createObjectURL(data) };
        //setup rest of the test
        //render component, select image, send image
        render(<Home />);

        //simulate selecting an image to dramify
        const fileHandler = screen.getByTestId("fileHandler");
        const file = new File(["(⌐■_■)"], "deepdream.png", { type: "image/png" });
        userEvent.upload(fileHandler, file);
        //wait until we know image has been set
        await waitFor(() => expect(screen.getByText(/(.*)Input image set:(.*)/i)).toBeInTheDocument());
        //send image
        jest.useFakeTimers();
        const button = screen.getByRole("button", { name: /make it dream/i });
        userEvent.click(button);
        jest.advanceTimersByTime(1000);
    });
    afterEach(() => {
        jest.clearAllTimers();
    });
    
    it("shows first response from server in console", async () => {
        await waitFor(() => expect(screen.getByText(/(.*)Processing image(.*)/i)).toBeInTheDocument());
    });

    it("console shows 'Done processing image'", async () => {
        await waitFor(() => expect(screen.getByText(/(.*)Done processing image(.*)/i)).toBeInTheDocument());
    });

    it("STOP DREAM button is ENABLED after sending image", async () => {
        await waitFor(() => expect(screen.getByRole("button", { name: /stop dream/i })).toBeEnabled());
    });

    it("STOP DREAM button click stops dream AND enables MAKE IT DREAM button", async () => {
        await waitFor(() => expect(screen.getByRole("button", { name: /stop dream/i })).toBeEnabled());

        const stopDream = screen.getByRole("button", { name: /stop dream/i });
        userEvent.click(stopDream);

        await waitFor(() => expect(screen.getByRole("button", { name: /make it dream/i })).toBeEnabled());
        await waitFor(() => expect(screen.getByText(/(.*)Dream stopped(.*)/i)).toBeInTheDocument());
    });

    it("MAKE IT DREAM button is DISABLED after sending image", async () => {
        await waitFor(() => expect(screen.getByRole("button", { name: /make it dream/i })).toBeDisabled());
    });

    it("DOWNLOAD DREAM button is ENABLED after processing image is done", async () => {
        await waitFor(() => expect(screen.getByText(/(.*)Done processing image(.*)/i)).toBeInTheDocument());
        await waitFor(() => expect(screen.getByRole("button", { name: /download dream/i })).toBeEnabled());
    });

    it("preview image is updated", async () => {
        jest.advanceTimersByTime(2000);
        const imageContainer = screen.getByRole("img");
        await waitFor(() => expect(imageContainer).toHaveStyle(`background-image: url(${api.getUrl(2)})`));
    });

});
