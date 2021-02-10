import React from "react";
import { Route } from "react-router-dom";
import Container from '@material-ui/core/Container';

import Home from "./routes/Home"
import About from "./routes/About"
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