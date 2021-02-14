import React from "react";
import { BrowserRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from "@testing-library/react";

import NavBar from "./NavBar";

describe("Navigation Bar", () => {
    
    const navLinks = [
        "What is DeepDream?",
        "Fork me on Github",
        "About"
    ];

    beforeEach(() => {
        render( <BrowserRouter> <NavBar /> </BrowserRouter>);
    })

    it("renders properly", async () => {
        expect(screen.getByRole("heading", {name: "DeepDream Maker"})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: "DeepDream Maker"})).toBeInTheDocument();
        navLinks.forEach(name => {
            expect(screen.getByRole("button", {name: name})).toBeInTheDocument();
        });
    });

    it("links work", async () => {
        //path window.open since it's not implemented in this test env
        window.open = jest.fn();
        //setup
        const mockedOpen = jest.fn();
        const windowOpenSpy = jest.spyOn(window, "open");
        windowOpenSpy.mockImplementation = mockedOpen;

        //test each button's click
        navLinks.forEach(name => {
            let btn = screen.getByRole("button", {name: name});
            userEvent.click(btn)
        });
        //verify links call window.open
        expect(windowOpenSpy).toHaveBeenCalledTimes(navLinks.length - 1);
        //the 3rd button uses react-router instead of a normal onclick call
        //we expect the url to change from localhost to localhost/about
        //when clicking this about button
        expect(window.location.pathname).toBe("/about");
    });
});