import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import Home from "./components/Home"
import About from "./components/About"
import NavBar from "./components/NavBar"


export default function App() {
    <>
    <NavBar />
    <Route path="/"><Home /></Route>
    <Route path="/about"><About /></Route>
    </>
}