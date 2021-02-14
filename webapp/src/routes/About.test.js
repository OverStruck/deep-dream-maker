import React from "react";
import { render, screen } from "@testing-library/react";

import About from "./About";

describe("About page", () => {
    it("renders properly", async () => {
        render(<About />)
    });
});
