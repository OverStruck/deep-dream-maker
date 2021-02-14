import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import FileDialogue from "./FileSelector"



describe("File Selector", () => {

    beforeEach(() => {
        const fakeFn = jest.fn();
        render(<FileDialogue handleUpload={fakeFn} />);
    });

    it("Check button is there", () => {
        expect(screen.getByRole("button")).toBeInTheDocument();
    })

    it("Check file handler is hidden", () => {
        expect(screen.getByTestId("fileHandler")).toHaveStyle("display: none")
    });

    it("Check file handler uploads files", () => {
        const fileHandler = screen.getByTestId("fileHandler");
        const file = new File(["(⌐■_■)"], "deepdream.png", { type: "image/png" });
        userEvent.upload(fileHandler, file);
        //test file upload
        expect(fileHandler.files[0]).toStrictEqual(file);
        expect(fileHandler.files.item(0)).toStrictEqual(file);
        expect(fileHandler.files).toHaveLength(1);
    })

});

