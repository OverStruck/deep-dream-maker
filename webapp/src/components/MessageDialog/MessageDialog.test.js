import React from "react";
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from "@testing-library/react";

import MessageDialog from "./MessageDialog";

describe("Message Dialog", () => {
    let fakeProps, mockCallback;
    beforeEach(() => {
        mockCallback = jest.fn();
        fakeProps = {
            title: "Error",
            open: true,
            onClose: mockCallback,
            msg: "Testing takes a lot of work"
        }
    });
    it("renders properly", async () => {
        //will render open dialog window
        render(<MessageDialog {...fakeProps} />);
        const testMessage = await screen.findByText(fakeProps.msg);
        expect(testMessage).toBeInTheDocument();
        //check some other stuff appear in the dialog
        expect(screen.getByRole("heading", { name: fakeProps.title })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
        //since we haven't close the dialog, no calls should be made
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("opens and closes properly by prop values", async () => {
        //render open dialog
        const { rerender } = render(<MessageDialog {...fakeProps} />);
        //verify dialog is there
        expect(screen.getByRole("presentation")).toBeInTheDocument();
        //simulate closing the dialog
        fakeProps.open = false;
        rerender(<MessageDialog {...fakeProps} />);
        //verify dialog is close
        await waitFor(() =>  expect(screen.queryByRole("presentation")).not.toBeInTheDocument() );
    });

    it("calls callback func on OK button click", async () => {
        render(<MessageDialog {...fakeProps} />);
        //wait until dialog is fully loaded
        await waitFor(() => expect(screen.getByText(fakeProps.msg)).toBeInTheDocument());
        //get OK button
        const okButton = screen.getByRole("button", { name: "OK" });
        //click button
        userEvent.click(okButton);
        //verify callback has been called 2 times on 2 clicks
        expect(mockCallback).toHaveBeenCalledTimes(1);
        userEvent.click(okButton);
        expect(mockCallback).toHaveBeenCalledTimes(2);

    });
});