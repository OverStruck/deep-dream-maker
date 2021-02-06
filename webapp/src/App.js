import React from "react";
import { Route } from "react-router-dom";
import Container from '@material-ui/core/Container';

import Home from "./components/Home"
import About from "./components/About"
import NavBar from "./components/NavBar"


export default function App() {
    return (
        <>
            <NavBar />
            <Container fixed>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/about"><About /></Route>
            </Container>
        </>
    );
}