import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import Home from "./components/Home"
import About from "./components/About"
import NavBar from "./components/NavBar"


export default function App() {
    return (
        <>
            <NavBar />
            <Route exact path="/"><Home /></Route>
            <Route exact path="/about"><About /></Route>
        </>
    );
}