import React from "react";
import Container from "@material-ui/core/Container";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./routes/Home"
import About from "./routes/About"
import NavBar from "./components/NavBar"

export default function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Container fixed>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/about"><About /></Route>
            </Container>
        </BrowserRouter>
    );
}
