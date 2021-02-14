import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Console from "./Console";



describe("Progress Bar", () => {
    let ref;
    beforeEach(() => {
        ref = React.createRef();
        render(<Console ref={ref} />);
    });

    it("renders properly", () => {
        const console = screen.getByRole("textbox");
        expect(console).toBeInTheDocument();
    });

    it("Displays first message", async () => {
        ref.current.add("This is a happy test :D");
        const testMessage = await screen.findByText(/This is a happy test :D/i);
        expect(testMessage).toBeInTheDocument();
    });

    it("Empties log after 100 messages", async () => {

        for (let i = 0; i <= 100; i++) {
            ref.current.add("This is a happy test #" + i);
        }
        //verify our last message is there
        const testMessage = await screen.findByText(/This is a happy test #100/i);
        expect(testMessage).toBeInTheDocument();
        //verify all other messages have been cleared
        expect(screen.queryByText(/This is a happy test #99/i)).not.toBeInTheDocument();
    });

});